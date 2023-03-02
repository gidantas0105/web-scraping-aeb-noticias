//Alterando o código para testar comandos git
//Alterando codigo para testar branch
//Alterando código para testar commit via gitHub
//Alterando codigo para testar pull para meu repo local
//Alterando o codigo para testar um push no repo remoto
//Teste branch no gitHub
//Teste push branch local pro github

const puppeteer = require("puppeteer"); // importe o pacote puppeteer
const palavrasChave = require("./palavrasChave");
/* Possibilidade: em express.js, incluir no middleware a execução da função scrape
com setInterval, como feito em comentário no final. 
Determinar o intervalo de acordo com pesquisa por um padrão no site.*/
 
 
let scrape = async () => { // crie uma função assíncrona que irá realizar o scraping
  const browser = await puppeteer.launch({
    headless: true,
  }); // cria um browser. A propriedade headless define se o browser irá abrir com interface gráfica ou se apenas irá executar em segundo plano, sem GUI. false = irá abrir interface gráfica; true = não irá abrir interface gráfica
 
  const page = await browser.newPage(); // cria uma nova aba no navegador acima
 
 
  await page.goto("https://www.gov.br/aeb/pt-br/assuntos/noticias"); // define a página que queremos acessar e a função goto navega até essa página
  
  const urls = await page.$$eval("article > div > h2 > a", (el) => {
    return el.map((a) => a.getAttribute("href"));
  });

  const posts = []; // vetor que conterá as postagens que são a resposta
  //for para caminhar em cada uma das URLS

  for (const url of urls) {
    await page.goto(url); // caminha para a URL 
    await page.waitForSelector("#parent-fieldname-text > div"); //espera até que o texto esteja disponível para ser selecionado
    
    const titulo = await page.$eval("article > h1", (title) => title.innerText); //seleciona o elemento que contém o título e aplica nele a função innerText, que retorna o texto do elemento 

    const tituloLowCase = titulo.toLowerCase();
    let reproduzir = false;

    for (const palavra of palavrasChave) {
      if (tituloLowCase.indexOf(palavra) != -1) {
        reproduzir = true;
        break;
      }
    }
    if (reproduzir === true) {
      const urlImagem = await page.$eval("img", (image) =>
        image.getAttribute("src")
      ); // seleciona o elemento da imagem e busca o atributo src da imagem, que contém a url da mesma.
      const dataHoraPublicacao = await page.$eval("span.value", (data) =>
        data.innerText.split(" ")
      );
      const dataPublicacao = dataHoraPublicacao[0];
      const horaPublicacao = dataHoraPublicacao[1];
      const autor = "Agência Espacial Brasileira";
      const fonte = "Agência Espacial Brasileira";

      const post = {
        titulo,
        url,
        urlImagem,
        dataPublicacao,
        horaPublicacao,
        autor,
        fonte
      }; // cria um objeto com as informações acima

      /*
      Na aplicação de fato, redefinir e executar a função create de NoticiasController
      para receber como parametro o objeto obtido pelo web scratching e postar 
      no banco de dados, como faz com as noticias postadas pelos adms.
      */

      posts.push(post); // adiciona o objeto no vetor 
    }
}
 
  browser.close(); // fecha o browser, indicando que finalizamos o scraping
  return posts;
};
 
 
//chamada da função scrape. O then/catch é para esperar que a função assíncrona termine e para que possamos tratar eventuais erros. 
scrape()
  .then((value) => {
    console.log(value);
    //exporta um vetor de objetos, cada um representando uma noticia.
  })
  .catch((error) => console.log(error))
