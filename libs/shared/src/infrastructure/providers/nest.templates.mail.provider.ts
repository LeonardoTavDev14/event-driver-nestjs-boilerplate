// importando classe abstrata ser implementada nesta classe
import { TemplatesMailProvider } from '@app/shared/application/providers/templates.mail.provider';

// importando injectable para ser um provider
import { Injectable } from '@nestjs/common';

@Injectable()
export class NestTemplatesMailProvider implements TemplatesMailProvider {
  welcomeMailTemplate(name: string, linkPlataform: string): string {
    return `
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Bem-vindo ao Daily Remaider</title>
</head>
<body style="margin:0; padding:0; background-color:#0f172a; font-family:Arial, Helvetica, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a; padding:40px 0;">
    <tr>
      <td align="center">
        
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#020617; border-radius:10px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.4);">
          
          <tr>
            <td style="padding:30px; text-align:center; background-color:#020617;">
              <h1 style="margin:0; color:#38bdf8; font-size:28px;">
                🚀 Daily Remaider
              </h1>
              <p style="margin:10px 0 0; color:#94a3b8; font-size:14px;">
                Organização de tarefas para times de desenvolvimento
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:30px; color:#e5e7eb; font-size:16px; line-height:1.6;">
              <p style="margin-top:0;">
                Seja muito bem-vindo(a)!, ${name} 🎉
              </p>

              <p>
                Sua conta no <strong style="color:#38bdf8;">Daily Remaider</strong> foi criada com sucesso.
                Aqui você organiza tarefas, fluxos e projetos do seu time de desenvolvimento de forma simples,
                visual e focada em produtividade.
              </p>

              <p>
                Pense no Daily Remaider como o equilíbrio perfeito entre <strong>Trello</strong> e <strong>Notion</strong>,
                mas feito sob medida para quem vive código, prazos e deploys.
              </p>

              <ul style="padding-left:20px; color:#e5e7eb;">
                <li>📌 Quadros e tarefas para projetos de programação</li>
                <li>👥 Colaboração em tempo real com seu time</li>
                <li>⚙️ Organização clara para sprints, bugs e features</li>
                <li>🧠 Menos bagunça, mais foco em entregar código</li>
              </ul>

              <p>
                Estamos muito felizes em ter você com a gente.
                Agora é só criar seu primeiro projeto e começar a organizar o caos 😄
              </p>

              <div style="text-align:center; margin:30px 0;">
                <a href="${linkPlataform}" 
                   style="background-color:#38bdf8; color:#020617; text-decoration:none; padding:14px 28px; border-radius:6px; font-weight:bold; display:inline-block;">
                  Acessar o Daily Remaider
                </a>
              </div>

              <p style="font-size:14px; color:#94a3b8;">
                Se você não criou essa conta, pode ignorar este email com segurança.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:20px; text-align:center; background-color:#020617; border-top:1px solid #1e293b;">
              <p style="margin:0; font-size:12px; color:#64748b;">
                © 2026 Daily Remaider. Todos os direitos reservados.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
  }
}
