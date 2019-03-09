---
title: "PDFs with Apache FOP"
date: 2014-07-03
category: post
path: /pdfs-with-apache-fop
---

We will leverage the power of Apache FOP which will reward your initial efforts with a maximum of freedom, especially regarding the styling. Using a library to generate the PDF programmatically is probably the desired way but you need to be aware of licensing restrictions.

Especially [iText](http://itextpdf.com/) can't be used in commercial products without purchasing a license since it's licensed under the [AGPL](http://en.wikipedia.org/wiki/Affero_General_Public_License). Alternatively, you can use [the last free version](https://github.com/ymasory/iText-4.2.0). Other commercial alternatives are [BFO](http://bfo.com/products/pdf/) or [ElegantJ](http://www.elegantjpdf.com/).

Open Source alternatives are [PDFBox](http://pdfbox.apache.org/), [PDF Clown](http://www.stefanochizzolini.it/en/projects/clown/) or [FOP](http://xmlgraphics.apache.org/fop/). There are also other libraries which have a very specific usage, namely [JasperReports](http://community.jaspersoft.com/project/jasperreports-library) and its abstractions [DynamicJasper](http://dynamicjasper.com/) or [DynamicReports](http://www.dynamicreports.org/).

All of these libraries - except iText, which is its distinctive advantage - have generally a steep learning curve.

The default workflow from zero to PDF with Apache FOP is the following:

1. Generate classes
2. Fill generated classes
3. Serialize the filled classes
4. Transform the XML
5. Convert to PDF

## 0. Dependencies

Be aware that we use Apache FOP in version 1.0 since 1.1 has a known bug which prevents the build.

```xml
<dependency>
   <groupId>org.apache.xmlgraphics</groupId>
    <artifactId>fop</artifactId>
    <version>1.0</version>
</dependency>
<dependency>
    <groupId>com.sun.xml.bind</groupId>
    <artifactId>jaxb-impl</artifactId>
    <version>2.2.8-b01</version>
</dependency>
```

Then we specify the Maven plugin which allows for class generation on a clean build:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.codehaus.mojo</groupId>
            <artifactId>jaxb2-maven-plugin</artifactId>
            <version>1.6</version>
            <executions>
                <execution>
                    <goals>
                        <goal>xjc</goal>
                    </goals>
                </execution>
            </executions>
            <configuration>
                <!-- Schema directory -->
                <schemaDirectory>${basedir}/src/main/resources</schemaDirectory>
            </configuration>
        </plugin>
    </plugins>
</build>
```

Note that, you don't point to the XSD file, just the directory with the file inside.

## 1. Generate classes

[JAXB](http://en.wikipedia.org/wiki/Java_Architecture_for_XML_Binding) can de-/serialize classes to and from XML. We will first write the XSD file `src/main/resources/report.xsd` which represents the structure of the generated classes:

```xml
<?xml version="1.0"?>
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema"
            elementFormDefault="qualified">

    <xsd:complexType name="employee">
        <xsd:sequence>
            <xsd:element name="fullname" type="xsd:string"/>
            <xsd:element name="mailaddress" type="xsd:string"/>
        </xsd:sequence>
    </xsd:complexType>

    <xsd:element name="report">
        <xsd:complexType>
            <xsd:sequence>
                <xsd:element name="header">
                    <xsd:complexType>
                        <xsd:sequence>
                            <xsd:element name="title" type="xsd:string"/>
                            <xsd:element name="author" type="employee"/>
                            <xsd:element name="creationdate" type="xsd:date"/>
                            <xsd:element name="content" type="xsd:string"/>
                        </xsd:sequence>
                    </xsd:complexType>
                </xsd:element>
            </xsd:sequence>
        </xsd:complexType>
    </xsd:element>
</xsd:schema>
```

This will create three distinct class files: `Employee`, `Report` and `ObjectFactory`.

## 2. Fill generated classes

Now we can programmatically fill these generated classes. Please note, that we use the `ObjectFactory` for creating the distinctive parts of our report, while this is not strictly necessary, it is good practice:

```java
ObjectFactory factory = new ObjectFactory();
Report report = factory.createReport();
Report.Header header = factory.createReportHeader();
Report.Content content = factory.createReportContent();

// Create and fill author
Employee author = factory.createEmployee();

author.setFullname("Max Mustermann");
author.setMailaddress("mustermann@mustermail.de");
header.setAuthor(author);

// Create and fill creationdate
GregorianCalendar calendar = new GregorianCalendar();
XMLGregorianCalendar xmlCalendar = DatatypeFactory.newInstance().newXMLGregorianCalendar(calendar);

header.setCreationdate(xmlCalendar);
header.setTitle("Report");
content.setText("Hello world.");
report.setHeader(header);
report.setContent(content);
```

## 3. Serialize the filled classes

We will write a generic class to build our report:

```java
public class Builder<T> {
    private static final Logger LOGGER = Logger.getLogger(Builder.class.getName());
    private final Class<T> type;
    private String xml;
    private String fo;

    public Builder(Class<T> type) {
        this.type = type;
    }
}
```

Which is instantiated with:

```java
Builder<Report> rb = new Builder(Report.class);
```

This class implements a method for serializing the filled class to XML. Instead of serializing to an object, we keep the XML in memory:

```java
public void toXML(T t) {
    StringWriter writer = new StringWriter();

    JAXBContext context = JAXBContext.newInstance(type);
    Marshaller marshaller = context.createMarshaller();

    marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
    marshaller.marshal(t, writer);

    xml = writer.toString();
}
```

If we print out the XML string via:

```java
rb.toXML(report);

System.out.println(rb.getXml());
```

We should see:

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<report>
    <header>
        <title>Report</title>
        <author>
            <fullname>Max Mustermann</fullname>
            <mailaddress>mustermann@mustermail.de</mailaddress>
        </author>
        <creationdate>2014-07-02+02:00</creationdate>
    </header>
    <content>
        <text>Hello world.</text>
    </content>
</report>
```

## 4. Transform the XML

In this step we need to create an XSL file that contains the directives for the XSLT processor to create the FO. The raw template looks like:

```xml
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
                xmlns:fo="http://www.w3.org/1999/XSL/Format">

    <xsl:output method="xml" indent="yes"/>

    // Root template
    // Header template
    // Content template
</xsl:stylesheet>
```

First we substitute the root template:

```xml
<xsl:template match="/">
    <fo:root>
        // Layout master set
        // Page sequence
    </fo:root>
</xsl:template>
```

We can be very specific about the page layout, here we use DIN-A4:

```xml
<fo:layout-master-set>
    <fo:simple-page-master master-name="A4"
                           page-height="297mm"
                           page-width="210mm"
                           margin-top="20mm"
                           margin-bottom="20mm"
                           margin-left="25mm"
                           margin-right="25mm">
        <fo:region-body margin-top="25mm"/>
        <fo:region-after region-name="footer" extent="15mm"/>
    </fo:simple-page-master>
</fo:layout-master-set>
```

There are four possible regions you can define:

* `region-body`: body
* `region-before`: header
* `region-after`: footer
* `region-start`: left side
* `region-end`: right side

The page sequence determines the sequence of content units. These units can be startic or dynamic and must match the named region:

```xml
<fo:page-sequence master-reference="A4">
    <fo:static-content flow-name="footer">
        <fo:block text-align="center">
            Page <fo:page-number/>
        </fo:block>
    </fo:static-content>

    <fo:flow flow-name="xsl-region-body">
        <xsl:apply-templates/>
    </fo:flow>
</fo:page-sequence>
```

Second we substitute the header template:

```xml
<xsl:template match="header">
    <fo:block>
        Title: <xsl:value-of select="title"/>
    </fo:block>
    <fo:block>
        Author: <xsl:value-of select="author/fullname"/> (<xsl:value-of select="author/mailaddress"/>)
    </fo:block>
    <fo:block>
        Date: <xsl:value-of select="creationdate"/>
    </fo:block>
</xsl:template>
```

And finally the content template:

```xml
<xsl:template match="content">
    <fo:block space-after="8pt"
              space-before="16pt">
        Content: <xsl:value-of select="text"/>
    </fo:block>
</xsl:template>
```

Here you can see, that each block can have separate style annotations.

We pass this XSL file to the transformer which will result in the required FO file, also cached in memory which you also can print just like the XML before:

```java
public void toFO(InputStream xsl) {
    StringWriter writer = new StringWriter();
    TransformerFactory factory = TransformerFactory.newInstance();
    Transformer transformer = factory.newTransformer(new StreamSource(xsl));

    Source src = new StreamSource(new StringReader(xml));
    Result res = new StreamResult(writer);

    transformer.transform(src, res);

    fo = writer.toString();
}
```

## 5. Generate PDF

The last step is to generate the PDF with Apache FOP which requires the FO file from the previous step:

```java
public void toPDF(OutputStream os) {
    FOUserAgent userAgent = FopFactory.newInstance().newFOUserAgent();
    Fop fop = FopFactory.newInstance().newFop(MimeConstants.MIME_PDF, userAgent, os);
    TransformerFactory factory = TransformerFactory.newInstance();
    Transformer transformer = factory.newTransformer();

    Source src = new StreamSource(new StringReader(fo));
    Result res = new SAXResult(fop.getDefaultHandler());

    transformer.transform(src, res);
}
```
