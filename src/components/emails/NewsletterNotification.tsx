import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { SITE_URL } from '../../consts'

interface NewsletterNotificationProps {
  email: string
  isSubscribed: boolean
  isNewUser: boolean
}

export default function NewsletterNotification({
  email,
  isSubscribed,
  isNewUser,
}: NewsletterNotificationProps) {
  const subscriptionStatus = isSubscribed ? 'subscribed to newsletter' : 'did not subscribe'
  const userStatus = isNewUser ? 'New subscriber' : 'Existing user updated subscription'

  return (
    <Html>
      <Head />
      <Preview>New newsletter subscription from {email}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={container}>
            <Heading style={heading}>New Newsletter Subscription</Heading>

            <Text style={paragraph}>
              Someone has subscribed to your newsletter through your website!
            </Text>

            <Hr style={hr} />

            <Text style={subheading}>Subscription Details:</Text>
            <Text style={paragraph}>
              <strong>Email:</strong> {email}
              <br />
              <strong>Status:</strong> {userStatus}
              <br />
              <strong>Newsletter:</strong> {subscriptionStatus}
            </Text>

            <Hr style={hr} />

            <Section style={buttonContainer}>
              <Button style={button} href={`${SITE_URL}/admin`} target="_blank">
                View in CMS
              </Button>
            </Section>

            <Text style={footer}>
              This notification was sent from your Lymphatic Specialists website newsletter form.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
}

const heading = {
  fontSize: '24px',
  lineHeight: '28px',
  fontWeight: 'bold',
  color: '#1a1a1a',
  marginBottom: '20px',
}

const subheading = {
  fontSize: '18px',
  lineHeight: '22px',
  fontWeight: 'bold',
  color: '#1a1a1a',
  marginTop: '20px',
  marginBottom: '10px',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#1a1a1a',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
}

const button = {
  backgroundColor: '#2b86a5',
  borderRadius: '25px',
  color: '#ffffff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px',
}

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  textAlign: 'center' as const,
  marginTop: '30px',
}
