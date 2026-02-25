import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class PenjualanService {
    constructor(private prisma: PrismaService) {}

    async create(data: any, user: any) {
        // console.log(data)

        for (const item of data.items) {
            const barang = await this.prisma.barang.findUnique({
                where: { id: item.id },
            });
            if (!barang) {
                throw new NotFoundException(
                    `Barang with id ${item.id} not found`,
                );
            }
        }

        const Query = {
            data: {
                user: {
                    connect: {
                        id: user.sub,
                    },
                },
                total: data.total,
                session: data.session ? data.session : 1,
                detailPenjualan: {
                    create: data.items.map((item) => {
                        return {
                            barangId: item.id,
                            jumlah: item.quantity,
                            hargaSatuan: new Decimal(item.hargaSatuan),
                            subtotal: new Decimal(item.subtotal),
                            hpp: new Decimal(0),
                        };
                    }),
                },
            },
            include: {
                detailPenjualan: true,
                user: true,
            },
        };
        // console.log(Query.data.detailPenjualan);
        const dbRes = await this.prisma.penjualan.create(Query);

        dbRes.detailPenjualan.forEach((detail) => {
            this.prisma.barang
                .findUnique({
                    where: { id: detail.barangId },
                })
                .then((barang) => {
                    if (barang) {
                        if (barang.hpp !== new Decimal(0))
                            this.prisma.detailPenjualan
                                .update({
                                    where: { id: detail.id },
                                    data: {
                                        hpp: new Decimal(
                                            barang.hpp.toNumber() *
                                                detail.jumlah,
                                        ),
                                    },
                                })
                                .then((res) => {
                                    console.log(res);
                                });
                        this.prisma.barang
                            .update({
                                where: { id: detail.barangId },
                                data: {
                                    qty: barang.qty - detail.jumlah,
                                },
                            })
                            .then((res) => {
                                if (barang.saleLokasiId == null) return;
                                this.prisma.stok
                                    .findFirst({
                                        where: {
                                            barangId: barang.id,
                                            lokasiId: barang.saleLokasiId,
                                        },
                                    })
                                    .then((stokLok) => {
                                        if (!stokLok) return;
                                        this.prisma.stok.update({
                                            where: { id: stokLok.id },
                                            data: {
                                                jumlah:
                                                    stokLok.jumlah -
                                                    detail.jumlah,
                                            },
                                        });
                                    });
                            });
                    }
                });
        });
        return { message: 'Penjualan created', data: dbRes };
    }

    async getTransaksiHarian(tanggal: string) {
        // Zona waktu UTC+7
        const gmtPlus7Offset = '+07:00';

        // Membuat objek Date untuk awal hari (00:00:00) pada UTC+7
        const startOfDay = new Date(`${tanggal}T00:00:00.000${gmtPlus7Offset}`);

        // Membuat objek Date untuk akhir hari (00:00:00 hari berikutnya) pada UTC+7
        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(startOfDay.getDate() + 1);

        // Mengambil data dari database
        return this.prisma.penjualan.findMany({
            where: {
                tanggal: {
                    gte: startOfDay,
                    lt: endOfDay,
                },
            },
            include: {
                detailPenjualan: {
                    include: {
                        barang: true,
                    },
                },
                user: {
                    select: {
                        username: true,
                    },
                },
            },
            orderBy: {
                tanggal: 'desc',
            },
        });
    }

    async findAll() {
        return this.prisma.penjualan.findMany({
            include: { detailPenjualan: true, user: true },
        });
    }

    async findOne(id: number) {
        return this.prisma.penjualan.findUnique({
            where: { id },
            include: { detailPenjualan: true, user: true },
        });
    }

    async findLast7Days() {
        const result: Array<{ date: Date; total: any }> = await this.prisma
            .$queryRaw`
            SELECT
                DATE(CONVERT_TZ(tanggal, '+00:00', '+07:00')) as date,
                SUM(total) as total
            FROM Penjualan
            WHERE DATE(CONVERT_TZ(tanggal, '+00:00', '+07:00')) >= DATE(CONVERT_TZ(NOW(), '+00:00', '+07:00')) - INTERVAL 6 DAY
            AND DATE(CONVERT_TZ(tanggal, '+00:00', '+07:00')) <= DATE(CONVERT_TZ(NOW(), '+00:00', '+07:00'))
            GROUP BY DATE(CONVERT_TZ(tanggal, '+00:00', '+07:00'))
            ORDER BY DATE(CONVERT_TZ(tanggal, '+00:00', '+07:00')) ASC
        `;

        // The result from queryRaw for SUM with Decimal can be a string or number depending on driver.
        // Let's ensure it's a number.
        return result.map((r) => ({
            date: r.date,
            total: Number(r.total) || 0,
        }));
    }

    async getDailyItemReport(date?: string) {
        let targetDate: Date;
        if (date && !isNaN(new Date(date).getTime())) {
            targetDate = new Date(date);
        } else {
            targetDate = new Date();
        }

        // adjust for timezone offset
        targetDate.setMinutes(
            targetDate.getMinutes() - targetDate.getTimezoneOffset(),
        );
        const formattedDate = targetDate.toISOString().split('T')[0];

        return this.prisma.$queryRaw`
            SELECT
            DATE(CONVERT_TZ(p.tanggal, '+00:00', '+07:00')) AS tanggal,
            dp.barangId,
            b.nama,
            dp.hargaSatuan,
            SUM(dp.jumlah) AS jumlah,
            SUM(dp.subtotal) AS amount,
            SUM(dp.hpp) AS totalHpp
        FROM DetailPenjualan dp
        JOIN Penjualan p ON dp.penjualanId = p.id
        JOIN Barang b ON dp.barangId = b.id
        WHERE DATE(CONVERT_TZ(p.tanggal, '+00:00', '+07:00')) = ${formattedDate}
        GROUP BY
            DATE(CONVERT_TZ(p.tanggal, '+00:00', '+07:00')),
            dp.barangId,
            b.nama,
            dp.hargaSatuan
        ORDER BY b.nama ASC;`;
    }

    async getDailySalesReport(date?: string) {
        let targetDate: Date;
        if (date && !isNaN(new Date(date).getTime())) {
            targetDate = new Date(date);
        } else {
            targetDate = new Date();
        }

        // adjust for timezone offset
        targetDate.setMinutes(
            targetDate.getMinutes() - targetDate.getTimezoneOffset(),
        );
        const formattedDate = targetDate.toISOString().split('T')[0];
        // console.log('Formatted Date:', formattedDate);

        return this.prisma.$queryRaw`
           SELECT
                DATE(CONVERT_TZ(p.tanggal, '+00:00', '+07:00')) AS tanggal,
                SUM(p.total) AS total
            FROM Penjualan p
            WHERE DATE(CONVERT_TZ(p.tanggal, '+00:00', '+07:00')) = ${formattedDate}
            GROUP BY DATE(CONVERT_TZ(p.tanggal, '+00:00', '+07:00'));
        `;
    }

    async getPenjualanBulananPerBarang(bulan: string) {
        const [year, month] = bulan.split('-').map(Number);

        // Membuat tanggal awal bulan (UTC+7)
        const startDate = new Date(`${year}-${month.toString().padStart(2, '0')}-01T00:00:00.000+07:00`);

        // Membuat tanggal akhir bulan (awal bulan berikutnya, UTC+7)
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1);

        const result = await this.prisma.$queryRaw`
            SELECT
                dp.barangId,
                b.nama,
                CAST(SUM(dp.jumlah) AS SIGNED) AS totalJumlah,
                CAST(SUM(dp.subtotal) AS DECIMAL(18, 2)) AS totalSubtotal
            FROM DetailPenjualan dp
            JOIN Barang b ON dp.barangId = b.id
            JOIN Penjualan p ON dp.penjualanId = p.id
            WHERE p.tanggal >= ${startDate} AND p.tanggal < ${endDate}
            GROUP BY dp.barangId, b.nama
            ORDER BY totalJumlah DESC;
        `;
        
        return result;
    }

    async generateReceipt(data: any, user: any) {
        // Implement receipt generation logic here
        const {
            ThermalPrinter,
            PrinterTypes,
            CharacterSet,
            BreakLine,
        } = require('node-thermal-printer');

        let printer = new ThermalPrinter({
            type: PrinterTypes.STAR, // Printer type: 'star' or 'epson'
            interface: 'tcp://xxx.xxx.xxx.xxx', // Printer interface
            characterSet: CharacterSet.PC852_LATIN2, // Printer character set
            removeSpecialCharacters: false, // Removes special characters - default: false
            lineCharacter: '=', // Set character for lines - default: "-"
            breakLine: BreakLine.WORD, // Break line after WORD or CHARACTERS. Disabled with NONE - default: WORD
            options: {
                // Additional options
                timeout: 5000, // Connection timeout (ms) [applicable only for network printers] - default: 3000
            },
        });

        let isConnected = await printer.isPrinterConnected(); // Check if printer is connected, return bool of status
        let execute = await printer.execute(); // Executes all the commands. Returns success or throws error
        let raw = await printer.raw(Buffer.from('Hello world')); // Print instantly. Returns success or throws error
        printer.print('Hello World'); // Append text
        printer.println('Hello World'); // Append text with new line
        printer.openCashDrawer(); // Kick the cash drawer
        printer.cut(); // Cuts the paper (if printer only supports one mode use this)
        printer.partialCut(); // Cuts the paper leaving a small bridge in middle (if printer supports multiple cut modes)
        printer.beep(); // Sound internal beeper/buzzer (if available)
        printer.upsideDown(true); // Content is printed upside down (rotated 180 degrees)
        printer.setCharacterSet(CharacterSet.PC852_LATIN2); // Set character set - default set on init
        printer.setPrinterDriver(Object); // Set printer drive - default set on init

        printer.bold(true); // Set text bold
        printer.invert(true); // Background/text color inversion
        printer.underline(true); // Underline text (1 dot thickness)
        printer.underlineThick(true); // Underline text with thick line (2 dot thickness)
        printer.drawLine(); // Draws a line
        printer.newLine(); // Inserts break line

        printer.alignCenter(); // Align text to center
        printer.alignLeft(); // Align text to left
        printer.alignRight(); // Align text to right

        printer.setTypeFontA(); // Set font type to A (default)
        printer.setTypeFontB(); // Set font type to B

        printer.setTextNormal(); // Set text to normal
        printer.setTextDoubleHeight(); // Set text to double height
        printer.setTextDoubleWidth(); // Set text to double width
        printer.setTextQuadArea(); // Set text to quad area
        printer.setTextSize(7, 7); // Set text height (0-7) and width (0-7)

        printer.leftRight('Left', 'Right'); // Prints text left and right
        printer.table(['One', 'Two', 'Three']); // Prints table equally
        printer.tableCustom([
            // Prints table with custom settings (text, align, width, cols, bold)
            { text: 'Left', align: 'LEFT', width: 0.5 },
            { text: 'Center', align: 'CENTER', width: 0.25, bold: true },
            { text: 'Right', align: 'RIGHT', cols: 8 },
        ]);

        printer.code128('Code128'); // Print code128 bar code
        printer.printQR('QR CODE'); // Print QR code
        await printer.printImage('./assets/olaii-logo-black.png'); // Print PNG image

        printer.clear(); // Clears printText value
        printer.getText(); // Returns printer buffer string value
        printer.getBuffer(); // Returns printer buffer
        // printer.setBuffer(newBuffer) // Set the printer buffer to a copy of newBuffer
        printer.getWidth();
        return { message: 'Receipt generated', data: data };
    }
}
