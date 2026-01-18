package com.imperialbookbinding.app.service;

import java.io.FileOutputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.stereotype.Service;

import com.imperialbookbinding.app.entity.Invoice;
import com.imperialbookbinding.app.entity.InvoiceItem;
import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

@Service
public class InvoicePdfService {

    private static final String BASE_PATH = "data/invoices/";

    public String generateInvoicePdf(
            Invoice invoice,
            List<InvoiceItem> items,
            Double amountPaid,
            Double balanceDue
    ) throws Exception {

        Files.createDirectories(Paths.get(BASE_PATH));

        String fileName = invoice.getInvoiceNumber() + ".pdf";
        String filePath = BASE_PATH + fileName;

        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, new FileOutputStream(filePath));

        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
        Font bold = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);
        Font normal = FontFactory.getFont(FontFactory.HELVETICA, 10);

        // Header
        document.add(new Paragraph("Imperial Binding Works", titleFont));
        document.add(new Paragraph("Book Binding & Finishing", normal));
        document.add(new Paragraph(" "));
        document.add(new Paragraph("Invoice No: " + invoice.getInvoiceNumber(), bold));
        document.add(new Paragraph("Date: " + invoice.getIssueDate(), normal));
        document.add(new Paragraph("Customer: " + invoice.getCustomer().getName(), normal));
        document.add(new Paragraph(" "));

        // Table
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{4, 1, 2, 2});

        table.addCell(new PdfPCell(new Phrase("Description", bold)));
        table.addCell(new PdfPCell(new Phrase("Qty", bold)));
        table.addCell(new PdfPCell(new Phrase("Rate", bold)));
        table.addCell(new PdfPCell(new Phrase("Amount", bold)));

        for (InvoiceItem item : items) {
            table.addCell(new Phrase(item.getDescription(), normal));
            table.addCell(new Phrase(item.getQuantity().toString(), normal));
            table.addCell(new Phrase(item.getRate().toString(), normal));
            table.addCell(new Phrase(item.getAmount().toString(), normal));
        }

        document.add(table);
        document.add(new Paragraph(" "));

        document.add(new Paragraph("Total: ₹" + invoice.getSubtotal(), bold));
        document.add(new Paragraph("Amount Paid: ₹" + amountPaid, normal));
        document.add(new Paragraph("Balance Due: ₹" + balanceDue, bold));

        document.close();

        return filePath;
    }
}

