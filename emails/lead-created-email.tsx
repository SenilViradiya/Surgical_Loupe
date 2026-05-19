import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface Props {
  customerName: string;

  frameName: string;

  lensName: string;
}

export function LeadCreatedEmail({
  customerName,
  frameName,
  lensName,
}: Props) {
  return (
    <Html>
      <Head />

      <Preview>
        Your quote request has been received
      </Preview>

      <Body
        style={{
          backgroundColor:
            "#f6f9fc",

          fontFamily:
            "Arial, sans-serif",
        }}
      >
        <Container
          style={{
            backgroundColor:
              "#ffffff",

            margin:
              "40px auto",

            padding: "32px",

            borderRadius:
              "12px",
          }}
        >
          <Heading>
            Quote Request Received
          </Heading>

          <Text>
            Hello{" "}
            {
              customerName
            },
          </Text>

          <Text>
            Thank you for your interest in our surgical loupe products.
          </Text>

          <Section>
            <Text>
              <strong>
                Frame:
              </strong>{" "}
              {
                frameName
              }
            </Text>

            <Text>
              <strong>
                Lens:
              </strong>{" "}
              {
                lensName
              }
            </Text>
          </Section>

          <Text>
            Our team will contact you shortly.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}