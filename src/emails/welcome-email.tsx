import { Body, Container, Head, Heading, Html, Link, Preview, Text } from "@react-email/components"

interface WelcomeEmailProps {
  username?: string
  loginUrl?: string
}

export default function WelcomeEmail({
  username = "there",
  loginUrl = "https://yourapp.com/auth/login",
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to our platform!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome {username}!</Heading>
          <Text style={text}>Thank you for joining our platform. We're excited to have you on board!</Text>
          <Text style={text}>
            You can now access your account and start exploring all the features we have to offer.
          </Text>
          <Link href={loginUrl} style={button}>
            Get Started
          </Link>
          <Text style={text}>If you have any questions, feel free to reach out to our support team.</Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
}

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
}

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
}

const button = {
  backgroundColor: "#007ee6",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
  margin: "20px 0",
}
