import { Body, Container, Head, Heading, Html, Link, Preview, Text } from "@react-email/components";

export interface WhitepaperDeliveryProps {
  firstName?: string;
  paperTitle?: string;
  paperDescription?: string;
  downloadUrl?: string;
  enquiryUrl?: string;
}

const main = { backgroundColor: "#ffffff", fontFamily: "Arial, sans-serif" };
const container = { padding: "32px 28px", maxWidth: "560px" };
const heading = { color: "#0B0D12", fontSize: "22px", fontWeight: 600 as const, lineHeight: "30px" };
const text = { color: "#242A35", fontSize: "15px", lineHeight: "24px" };
const muted = { color: "#6B7280", fontSize: "13px", lineHeight: "20px" };
const button = {
  display: "inline-block",
  backgroundColor: "#0A66FF",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: 600 as const,
  padding: "12px 22px",
  textDecoration: "none",
  marginTop: "8px",
  marginBottom: "8px",
};

export function WhitepaperDeliveryEmail({ firstName, paperTitle, paperDescription, downloadUrl, enquiryUrl }: WhitepaperDeliveryProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Your requested XWC research report is ready</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Your XWC research report</Heading>
          <Text style={text}>Hi {firstName || "there"},</Text>
          <Text style={text}>
            Thank you for requesting our research, <strong>{paperTitle}</strong>.
          </Text>
          <Text style={text}>
            Your full report is ready as a PDF. It examines {paperDescription} and includes practical decision frameworks for evaluating the challenge.
          </Text>
          <Text style={text}>
            <Link href={downloadUrl} style={button}>Download the full report (PDF)</Link>
          </Text>
          <Text style={muted}>
            This secure download link is personal to you and expires after 72 hours. If it expires, simply request the report again from the same page.
          </Text>
          <Text style={text}>
            If your team is currently reviewing a related initiative, you can share the situation with XWC here:{" "}
            <Link href={enquiryUrl} style={{ color: "#0A66FF" }}>start a conversation</Link>.
          </Text>
          <Text style={text}>
            Best regards,
            <br />
            XWC / Xyncwave Corporation LLP
            <br />
            <Link href="https://xyncwave.com" style={{ color: "#0A66FF" }}>https://xyncwave.com</Link>
          </Text>
          <Text style={muted}>
            You received this email because you requested this report on the Xyncwave website. Your details are handled according to our privacy policy.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
