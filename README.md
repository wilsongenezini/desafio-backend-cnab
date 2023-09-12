# Desafio para a vaga de Desenvolvedor Back-end na Enviabybus.

Este projeto foi desenvolvido como critério de avalição para a vaga de **Desenvolvedor Back-end** na empresa [Enviabybus](https://www.enviabybus.com.br). O programa consiste em receber um arquivo de texto "CNAB" (constituído por caracteres que representam dados de movimentações financeiras de várias lojas), onde os dados serão tratados e exibidos através de API.

> Como utilizar a API.

Para consumir o endpoint da API, o console irá exibir a mensagem com a instrução (altere a porta como desejar). Após upar o arquivo de texto CNAB na API, os dados serão salvos no banco de dados, em suas devidas coleções ("*operations*" para dados válidos e "*operationswitherros*" para dados inválidos) e posteriormente exibidos em formato JSON, com o adicional de possuir uma listagem que filtra as operações por loja, com o totalizador do saldo em conta.

▶ **Ferramentas e Tecnologias utilizadas para o projeto**

| Ícone | Nome |
| :---: | :---: |
| [![My Skills](https://skillicons.dev/icons?i=vscode&theme=light)](https://skillicons.dev) | Visual Studio Code |
| [![My Skills](https://skillicons.dev/icons?i=ts&theme=light)](https://skillicons.dev) | TypeScript |
| [![My Skills](https://skillicons.dev/icons?i=nodejs&theme=light)](https://skillicons.dev) | Node.js |
| [![My Skills](https://skillicons.dev/icons?i=mongodb&theme=light)](https://skillicons.dev) | MongoDB |
| [![My Skills](https://skillicons.dev/icons?i=git&theme=light)](https://skillicons.dev) | Git |
| [![My Skills](https://skillicons.dev/icons?i=github&theme=light)](https://skillicons.dev) | GitHub |

▶ **Dependências do Node.js**

| Nome | Descrição |
| :---: | :--- |
| types/node | fornece definições de tipos |
| nodemon | monitora alterações em arquivos e reinicia o servidor |
| typescript | adiciona tipos estáticos |
| date-fns | manipulação de datas e horários |
| dotenv | carrega variáveis sensíveis de ambiente |
| express | framework que facilita a criação de aplicativos e APIs |
| mongoose | simplifica a interação com bancos de dados MongoDB |
| multer | middleware para processamento de upload de arquivos |
