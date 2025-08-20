import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface ReservaAprovadaEmailProps {
  nome: string
  livroTitulo: string
  livroAutor: string
  numeroReserva: string
  dataLimiteRetirada: string
  localizacaoFisica: string
  linkAcompanhamento: string
}

export const ReservaAprovadaEmail = ({
  nome,
  livroTitulo,
  livroAutor,
  numeroReserva,
  dataLimiteRetirada,
  localizacaoFisica,
  linkAcompanhamento,
}: ReservaAprovadaEmailProps) => (
  <Html>
    <Head />
    <Preview>✅ Sua solicitação foi aprovada - {livroTitulo}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>✅ Solicitação Aprovada!</Heading>
        
        <Text style={text}>Olá {nome},</Text>
        
        <Text style={text}>
          Ótimas notícias! Sua solicitação de empréstimo foi <strong>aprovada</strong>.
        </Text>

        <Section style={approvalBox}>
          <Text style={approvalText}>
            <strong>Número da Reserva:</strong> {numeroReserva}<br/>
            <strong>Livro:</strong> {livroTitulo}<br/>
            <strong>Autor:</strong> {livroAutor}<br/>
            <strong>Localização:</strong> {localizacaoFisica}<br/>
            <strong>Retirar até:</strong> {dataLimiteRetirada}
          </Text>
        </Section>

        <Section style={instructionBox}>
          <Text style={instructionTitle}>📍 Próximos Passos:</Text>
          <Text style={instructionText}>
            1. Dirija-se à biblioteca da igreja<br/>
            2. Apresente este e-mail ou informe o número da reserva<br/>
            3. Retire o livro até a data limite indicada<br/>
            4. Cuide bem do livro e devolva no prazo combinado
          </Text>
        </Section>

        <Link
          href={linkAcompanhamento}
          target="_blank"
          style={button}
        >
          Acompanhar Empréstimo
        </Link>

        <Hr style={hr} />

        <Text style={footer}>
          <strong>Biblioteca CBN Kerigma</strong><br/>
          Este é um e-mail automático, não responda a esta mensagem.<br/>
          Para dúvidas, entre em contato conosco diretamente.
        </Text>
      </Container>
    </Body>
  </Html>
)

const main = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
}

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '20px',
}

const h1 = {
  color: '#059669',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '30px 0',
  padding: '0',
  textAlign: 'center' as const,
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '16px 0',
}

const approvalBox = {
  backgroundColor: '#ecfdf5',
  border: '2px solid #10b981',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
}

const approvalText = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0',
}

const instructionBox = {
  backgroundColor: '#f8fafc',
  borderLeft: '4px solid #3b82f6',
  padding: '20px',
  margin: '20px 0',
}

const instructionTitle = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
}

const instructionText = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
}

const button = {
  backgroundColor: '#059669',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  margin: '20px 0',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '30px 0',
}

const footer = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '1.5',
  textAlign: 'center' as const,
  margin: '30px 0',
}