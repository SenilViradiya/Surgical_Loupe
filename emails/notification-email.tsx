import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface Props {
  title: string;
  message: string;
  preview: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export function NotificationEmail({ title, message, preview, ctaLabel, ctaUrl }: Props) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: "#f6f9fc", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ backgroundColor: "#ffffff", margin: "40px auto", padding: "32px", borderRadius: "12px", maxWidth: "640px" }}>
          <Heading style={{ marginBottom: "16px" }}>{title}</Heading>
          <Text style={{ color: "#0f172a", lineHeight: 1.6 }}>{message}</Text>
          {ctaUrl && ctaLabel ? (
            <Section style={{ marginTop: "24px" }}>
              <Button href={ctaUrl}>{ctaLabel}</Button>
            </Section>
          ) : null}
        </Container>
      </Body>
    </Html>
  );
}
