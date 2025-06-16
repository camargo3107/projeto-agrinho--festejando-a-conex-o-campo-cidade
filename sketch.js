// --- Variáveis Globais do Jogo ---

let estadoDoJogo = 'INICIO'; // Pode ser 'INICIO', 'JOGANDO', 'FIM'

let pontuacao = 0;
let indicePerguntaAtual = 0; // Começa da primeira pergunta (índice 0)

let tempoLimitePorPergunta = 15; // Segundos (você pode ajustar este valor)
let tempoRestante; // Será o tempo restante da pergunta atual
let tempoInicialPergunta; // Para calcular o tempo decorrido
let yTextoOpcoes = 0; // Posição Y inicial para as opções

let mensagemFeedback = ""; // Mensagem para "Certo!" ou "Errado!"
let tempoFeedbackInicio; // Para controlar o tempo que a mensagem de feedback fica na tela
const DURACAO_FEEDBACK = 1500; // 1.5 segundos em milissegundos

// --- Dados das Perguntas (Array de Objetos) ---
// Atenção: A 'respostaCorreta' aqui se refere ao CONTEÚDO da resposta, não à letra (A,B,C,D).
// A letra será determinada dinamicamente após o embaralhamento.
let perguntas = [
  {
    pergunta: "Qual a principal contribuição do campo para a cidade na alimentação?",
    opcoes: ["Produção de automóveis", "Fornecimento de energia elétrica", "Produção de alimentos", "Desenvolvimento de softwares"],
    respostaCorretaConteudo: "Produção de alimentos"
  },
  {
    pergunta: "O que a cidade geralmente oferece ao campo que contribui para a produção agrícola?",
    opcoes: ["Chuva e sol", "Máquinas e tecnologia", "Montanhas e rios", "Animais selvagens"],
    respostaCorretaConteudo: "Máquinas e tecnologia"
  },
  {
    pergunta: "Qual a importância das estradas e rodovias na conexão campo-cidade?",
    opcoes: ["Servem apenas para passeios", "Permitem o transporte de produtos e pessoas", "São usadas para plantar", "Dividem as paisagens"],
    respostaCorretaConteudo: "Permitem o transporte de produtos e pessoas"
  },
  {
    pergunta: "Muitos trabalhadores rurais migram para as cidades em busca de:",
    opcoes: ["Mais natureza", "Novas oportunidades de emprego e serviços", "Melhor acesso à terra", "Silêncio e isolamento"],
    respostaCorretaConteudo: "Novas oportunidades de emprego e serviços"
  },
  {
    pergunta: "O que acontece se a conexão entre campo e cidade é interrompida?",
    opcoes: ["As cidades ficam mais calmas", "O campo não consegue escoar sua produção e a cidade fica sem suprimentos", "Não há impacto significativo", "O clima melhora para ambos"],
    respostaCorretaConteudo: "O campo não consegue escoar sua produção e a cidade fica sem suprimentos"
  },
  {
    pergunta: "Qual produto comum que consumimos na cidade tem sua origem majoritariamente no campo?",
    opcoes: ["Celulares", "Pães e laticínios", "Carros", "Computadores"],
    respostaCorretaConteudo: "Pães e laticínios"
  },
  {
    pergunta: "Além de alimentos, o campo também fornece à cidade:",
    opcoes: ["Internet de alta velocidade", "Matérias-primas para indústrias (madeira, algodão)", "Grandes edifícios", "Centros comerciais"],
    respostaCorretaConteudo: "Matérias-primas para indústrias (madeira, algodão)"
  },
  {
    pergunta: "O que o conceito de 'agricultura familiar' representa na conexão campo-cidade?",
    opcoes: ["Fazendas que cultivam apenas para a família", "Grande parte da produção de alimentos consumidos nas cidades", "Apenas plantações de flores", "Fazendas sem tecnologia"],
    respostaCorretaConteudo: "Grande parte da produção de alimentos consumidos nas cidades"
  },
  {
    pergunta: "A demanda por produtos orgânicos na cidade influencia diretamente o campo, incentivando:",
    opcoes: ["O uso de mais agrotóxicos", "Práticas agrícolas sustentáveis", "A diminuição das plantações", "A importação de todos os alimentos"],
    respostaCorretaConteudo: "Práticas agrícolas sustentáveis"
  },
  {
    pergunta: "A tecnologia desenvolvida na cidade (ex: tratores, drones) impacta o campo ao:",
    opcoes: ["Diminuir a produtividade", "Aumentar a eficiência e a produção", "Aumentar o custo das sementes", "Poluir o solo desnecessariamente"],
    respostaCorretaConteudo: "Aumentar a eficiência e a produção"
  }
];

// Variável para armazenar as opções embaralhadas da pergunta atual (com as letras A, B, C, D)
let opcoesEmbaralhadasComLetras;

// --- Configurações Visuais das Opções ---
const LARGURA_OPCAO = 500;
const ALTURA_OPCAO = 60;
const ESPACAMENTO_OPCOES = 20;

// --- Funções Essenciais do p5.js ---

function setup() {
  createCanvas(1000, 900); // Define o tamanho da tela do jogo
  textAlign(CENTER, CENTER); // Alinha o texto ao centro
  rectMode(CENTER); // Desenha retângulos a partir do centro
  ellipseMode(CENTER); // Desenha elipses a partir do centro

  // Calcula a posição Y inicial das opções para centralizá-las
  yTextoOpcoes = height / 2 + 50; // Ajuste este valor se precisar
}

function draw() {
  background(200); // Cor de fundo padrão (cinza claro)

  if (estadoDoJogo === 'INICIO') {
    desenharTelaInicial();
  } else if (estadoDoJogo === 'JOGANDO') {
    desenharTelaJogo();
  } else if (estadoDoJogo === 'FIM') {
    desenharTelaFinal();
  }
}

function mousePressed() {
  if (estadoDoJogo === 'INICIO') {
    estadoDoJogo = 'JOGANDO';
    iniciarNovaPergunta(); // Começa a primeira pergunta
  } else if (estadoDoJogo === 'JOGANDO') {
    verificarCliqueOpcao(mouseX, mouseY);
  } else if (estadoDoJogo === 'FIM') {
    reiniciarJogo();
  }
}

// --- Funções de Desenho das Telas ---

function desenharTelaInicial() {
  background(150, 200, 255); // Um azul claro para o céu

  // Título
  fill(0); // Cor preta para o texto
  textSize(48);
  text("Quiz: Conexão Vital", width / 2, height / 4);

  // Tema
  textSize(24);
  text("Festejando a conexão campo-cidade", width / 2, height / 3);

  // Instruções
  textSize(20);
  fill(50);
  text("Instruções:", width / 2, height / 2 - 40);
  text("Responda 10 perguntas sobre a importância do campo e da cidade.", width / 2, height / 2);
  text("Clique na opção correta antes que o tempo acabe.", width / 2, height / 2 + 30);
  text("O jogo tem 10 perguntas. Sua pontuação será exibida no final.", width / 2, height / 2 + 60);
  text("Clique em qualquer lugar para começar!", width / 2, height / 2 + 120);
}

function desenharTelaJogo() {
  background(200, 255, 200); // Um verde claro para a tela do jogo

  // Obter a pergunta atual
  let perguntaAtual = perguntas[indicePerguntaAtual];

  // Exibir Pergunta
  fill(0);
  textSize(28);
  text(perguntaAtual.pergunta, width / 2, height / 4);

  // Exibir Opções embaralhadas
  textSize(20);
  let yPosicaoOpcao = yTextoOpcoes;
  for (let i = 0; i < opcoesEmbaralhadasComLetras.length; i++) {
    let xOpcao = width / 2;
    let yOpcao = yPosicaoOpcao + (i * (ALTURA_OPCAO + ESPACAMENTO_OPCOES));

    // Desenha o retângulo da opção
    fill(200, 200, 255); // Cor do botão
    rect(xOpcao, yOpcao, LARGURA_OPCAO, ALTURA_OPCAO, 10); // Retângulo arredondado

    // Desenha o texto da opção
    fill(0); // Cor do texto
    text(opcoesEmbaralhadasComLetras[i], xOpcao, yOpcao);
  }

  // Exibir Pontuação
  fill(0);
  textSize(24);
  text("Pontuação: " + pontuacao, width - 100, 30);

  // Exibir Tempo Restante
  let tempoDecorrido = (millis() - tempoInicialPergunta) / 1000; // Tempo em segundos
  tempoRestante = max(0, tempoLimitePorPergunta - floor(tempoDecorrido));

  fill(255, 0, 0); // Vermelho para o tempo
  textSize(32);
  text("Tempo: " + tempoRestante, 100, 30);

  // Verifica se o tempo acabou para a pergunta atual
  if (tempoRestante <= 0 && estadoDoJogo === 'JOGANDO' && mensagemFeedback === "") { // Adicionado && mensagemFeedback === "" para evitar duplicação
    // Se o tempo acabou, considera a resposta errada e passa para a próxima
    mostrarFeedback("Errado! Tempo esgotado.");
    // A função `passarParaProximaPergunta()` será chamada após o feedback
  }

  // Exibir feedback (Certo!/Errado!)
  if (mensagemFeedback !== "") {
    let tempoAtual = millis();
    if (tempoAtual - tempoFeedbackInicio < DURACAO_FEEDBACK) {
      if (mensagemFeedback.includes("Certo!")) {
        fill(0, 150, 0); // Verde para "Certo!"
      } else {
        fill(200, 0, 0); // Vermelho para "Errado!"
      }
      textSize(36);
      text(mensagemFeedback, width / 2, height / 2 - 100);
    } else {
      // Limpa o feedback e passa para a próxima pergunta após o tempo
      mensagemFeedback = "";
      passarParaProximaPergunta();
    }
  }
}

function desenharTelaFinal() {
  background(255, 255, 150); // Um amarelo claro para a tela final

  // Título
  fill(0);
  textSize(48);
  text("Fim de Jogo!", width / 2, height / 3);

  // Pontuação Final
  textSize(36);
  text("Sua Pontuação Final: " + pontuacao + " / " + perguntas.length, width / 2, height / 2);

  // Mensagem de parabéns
  textSize(28);
  if (pontuacao === perguntas.length) {
    text("Parabéns! Você é um expert na Conexão Vital!", width / 2, height / 2 + 60);
  } else if (pontuacao >= perguntas.length * 0.7) { // Ex: 70% de acerto para boa pontuação
    text("Muito bom! Excelente Conexão!", width / 2, height / 2 + 60);
  } else if (pontuacao >= perguntas.length * 0.4) {
    text("Bom começo! Continue aprendendo para fortalecer essa conexão!", width / 2, height / 2 + 60);
  } else {
    text("Continue praticando para entender melhor essa conexão!", width / 2, height / 2 + 60);
  }

  // Botão para reiniciar
  fill(0, 150, 0); // Cor verde para o botão
  rect(width / 2, height * 0.8, 250, 60, 10); // Botão "Reiniciar"
  fill(255); // Cor branca para o texto do botão
  textSize(24);
  text("Jogar Novamente", width / 2, height * 0.8);
}


// --- Funções de Lógica do Jogo ---

// Função para embaralhar um array (algoritmo Fisher-Yates)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = floor(random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Troca elementos
  }
}

function iniciarNovaPergunta() {
  // Reinicia o temporizador para a nova pergunta
  tempoInicialPergunta = millis();
  mensagemFeedback = ""; // Limpa qualquer feedback anterior

  // Embaralha as opções da pergunta atual
  let perguntaAtual = perguntas[indicePerguntaAtual];
  let tempOpcoes = [...perguntaAtual.opcoes]; // Cria uma cópia para embaralhar
  shuffleArray(tempOpcoes);

  // Atribui as letras (A, B, C, D) às opções embaralhadas
  opcoesEmbaralhadasComLetras = [];
  const letras = ['A', 'B', 'C', 'D'];
  for (let i = 0; i < tempOpcoes.length; i++) {
    opcoesEmbaralhadasComLetras.push(letras[i] + ") " + tempOpcoes[i]);
  }
}

function verificarCliqueOpcao(x, y) {
  if (mensagemFeedback !== "") return; // Impede cliques enquanto o feedback está na tela

  let perguntaAtual = perguntas[indicePerguntaAtual];
  let respostaSelecionadaConteudo = ''; // Agora vamos verificar pelo CONTEÚDO da resposta

  // Verifica qual opção foi clicada
  for (let i = 0; i < opcoesEmbaralhadasComLetras.length; i++) {
    let xOpcao = width / 2;
    let yOpcao = yTextoOpcoes + (i * (ALTURA_OPCAO + ESPACAMENTO_OPCOES));

    // Define os limites do retângulo da opção para detecção de clique
    let left = xOpcao - LARGURA_OPCAO / 2;
    let right = xOpcao + LARGURA_OPCAO / 2;
    let top = yOpcao - ALTURA_OPCAO / 2;
    let bottom = yOpcao + ALTURA_OPCAO / 2;

    if (x > left && x < right && y > top && y < bottom) {
      // Opção clicada! Extrai o conteúdo da resposta (sem a letra A, B, C, D)
      // Ex: "A) Produção de alimentos" -> "Produção de alimentos"
      respostaSelecionadaConteudo = opcoesEmbaralhadasComLetras[i].substring(3);
      break;
    }
  }

  if (respostaSelecionadaConteudo !== '') {
    if (respostaSelecionadaConteudo === perguntaAtual.respostaCorretaConteudo) {
      pontuacao++;
      mostrarFeedback("Certo!");
    } else {
      mostrarFeedback("Errado! A resposta correta era: " + perguntaAtual.respostaCorretaConteudo + ".");
    }
  }
}

function mostrarFeedback(mensagem) {
  mensagemFeedback = mensagem;
  tempoFeedbackInicio = millis();
}


function passarParaProximaPergunta() {
  indicePerguntaAtual++;
  if (indicePerguntaAtual < perguntas.length) {
    iniciarNovaPergunta(); // Inicia o tempo para a próxima pergunta
  } else {
    estadoDoJogo = 'FIM'; // Todas as perguntas foram respondidas
  }
}

function reiniciarJogo() {
  estadoDoJogo = 'INICIO';
  pontuacao = 0;
  indicePerguntaAtual = 0;
  mensagemFeedback = "";
  tempoRestante = tempoLimitePorPergunta; // Reinicia o tempo para o próximo jogo
}