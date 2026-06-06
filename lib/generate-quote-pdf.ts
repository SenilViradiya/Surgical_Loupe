import jsPDF from "jspdf";

interface Props {
  customer: {
    fullName: string;

    email: string;

    phone: string;
  };

  configuration: {
    frame: {
      name: string;

      price: number;
    };

    lens: {
      name: string;

      price: number;
    };

    headlight?: {
      name: string;

      price: number;
    } | null;
  };
}

export function generateQuotePDF({
  customer,
  configuration,
}: Props) {
  const doc =
    new jsPDF();

  const total =
    configuration.frame.price +
    configuration.lens.price +
    (configuration.headlight
      ?.price ?? 0);

  doc.setFontSize(22);

  doc.text(
    "Surgical Loupe Quote",
    20,
    20
  );

  doc.setFontSize(12);

  doc.text(
    `Customer: ${customer.fullName}`,
    20,
    40
  );

  doc.text(
    `Email: ${customer.email}`,
    20,
    50
  );

  doc.text(
    `Phone: ${customer.phone}`,
    20,
    60
  );

  doc.setFontSize(16);

  doc.text(
    "Configuration",
    20,
    90
  );

  doc.setFontSize(12);

  doc.text(
    `Frame: ${configuration.frame.name}`,
    20,
    110
  );

  doc.text(
    `Frame Price: ₹${configuration.frame.price}`,
    20,
    120
  );

  doc.text(
    `Lens: ${configuration.lens.name}`,
    20,
    140
  );

  doc.text(
    `Lens Price: ₹${configuration.lens.price}`,
    20,
    150
  );

  if (
    configuration.headlight
  ) {
    doc.text(
      `Headlight: ${configuration.headlight.name}`,
      20,
      170
    );

    doc.text(
      `Headlight Price: ₹${configuration.headlight.price}`,
      20,
      180
    );
  }

  doc.setFontSize(18);

  doc.text(
    `Total: ₹${total}`,
    20,
    220
  );

  doc.save(
    "quote.pdf"
  );
}
