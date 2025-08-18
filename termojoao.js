const palavras = [
"amigo","bolas","carro","casal","coisa","feliz","forte","fruta","gente","grupo",
"hora","ideia","jovem","lugar","mundo","noite","pasta","peito","poder","praia",
"queda","razao","salto","sorte","tarde","tempo","vento","vida","vozes","abuso",
"acima","adeus","ainda","alamo","aluno","antes","apoio","aroma","assar","astro",
"atlas","aviso","banjo","banho","barco","beijo","bingo","blusa","bloco","bomba",
"brisa","bravo","banco","caixa","canto","carne","chave","chico","clima","cobra",
"cofre","corpo","cerca","criar","custo","dente","dados","dorso","dupla","costa",
"fases","fatos","falar","favor","forca","fluir","fome","forno","freio","fraco",
"fundo","garra","galho","gosto","grato","graus","havia","horas","homem","ilha",
"inves","jogar","junta","janela","lagoa","letra","linha","livro","longo","luzes",
"trote","maior","manga","maria","matar","meias","menor","metro","natal","navio",
"negro","nuvem","obras","olhar","opcao","ovos","palma","peixe","plano","poema",
"ponto","porta","quase","quente","ramos","rural","santo","teste","trago","trata",
"trigo","tumba","turma","unico","usado","vales","vamos","verde","viaje","viver",
"aceno","acido","afeto","agudo","frota","altar","amplo","anexo","animo","apelo",
"armas","azedo","borda","breve","burro","caber","cacao","ponte","carta","cesta",
"clube","couro","dardo","dedos","dever","exato","exito","fazer","feroz","festa",
"ficar","firme","focos","haver","honra","hotel","humor","ideal","ilhas","justo",
"lazer","lento","magia","marco","media","menos","mesas","minas","moeda","morte",
"novas","oculo","parar","parte"
];
const maxTentativas = 6;

// ------------------ Palavra do dia ------------------
function palavraDoDia() {
  const hoje = new Date().toISOString().split('T')[0];
  const palavraSalva = localStorage.getItem('palavraDoDia');
  const dataSalva = localStorage.getItem('dataPalavra');

  if (palavraSalva && dataSalva === hoje) {
    return palavraSalva;
  } else {
    let novaPalavra;
    let usadas = JSON.parse(localStorage.getItem('palavrasUsadas') || "[]");
    do {
      novaPalavra = palavras[Math.floor(Math.random() * palavras.length)];
    } while (usadas.includes(novaPalavra));

    usadas.push(novaPalavra);
    localStorage.setItem('palavrasUsadas', JSON.stringify(usadas));
    localStorage.setItem('palavraDoDia', novaPalavra);
    localStorage.setItem('dataPalavra', hoje);
    localStorage.setItem('tentativas', 0);
    localStorage.removeItem('jogouHoje');
    return novaPalavra;
  }
}

const palavraCorreta = palavraDoDia();
let tentativas = Number(localStorage.getItem('tentativas') || 0);

// ------------------ Bloqueio se já jogou ------------------
window.onload = function() {
  const jogouHoje = localStorage.getItem('jogouHoje');
  const hoje = new Date().toISOString().split('T')[0];
  const dataPalavra = localStorage.getItem('dataPalavra');

  if (jogouHoje === 'sim' && dataPalavra === hoje) {
    document.getElementById("tentativa").disabled = true;
    document.getElementById("mensagem").textContent = "⚠️ Você já jogou hoje! Volte amanhã!";
  }
}

// ------------------ Função verificar ------------------
function verificar() {
  const tentativaInput = document.getElementById("tentativa");
  const tentativa = tentativaInput.value.toLowerCase();

  if (tentativa.length !== palavraCorreta.length) {
    document.getElementById("mensagem").textContent = 
      `Digite uma palavra com ${palavraCorreta.length} letras!`;
    return;
  }

  tentativas++;
  localStorage.setItem('tentativas', tentativas);
  mostrarTentativa(tentativa);

  if (tentativa === palavraCorreta) {
    document.getElementById("mensagem").textContent =
      `🎉 Parabéns! Você acertou em ${tentativas} tentativas!`;
    localStorage.setItem('jogouHoje', 'sim');
    document.getElementById("tentativa").disabled = true;
    soltarConfete();
    return;
  }

  if (tentativas >= maxTentativas) {
    document.getElementById("mensagem").textContent =
      `💀 Fim de jogo! A palavra era: ${palavraCorreta}`;
    localStorage.setItem('jogouHoje', 'sim');
    document.getElementById("tentativa").disabled = true;
  } else {
    document.getElementById("mensagem").textContent =
      `Você tem ${maxTentativas - tentativas} tentativas restantes.`;
  }

  tentativaInput.value = "";
}

// ------------------ Mostrar tentativa ------------------
function mostrarTentativa(tentativa) {
  const linha = document.createElement("div");
  linha.classList.add("linha");

  for (let i = 0; i < tentativa.length; i++) {
    const letraDiv = document.createElement("div");
    letraDiv.classList.add("letra");

    if (tentativa[i] === palavraCorreta[i]) {
      letraDiv.classList.add("correto");
    } else if (palavraCorreta.includes(tentativa[i])) {
      letraDiv.classList.add("posicao-errada");
    } else {
      letraDiv.classList.add("errado");
    }

    letraDiv.textContent = tentativa[i];
    linha.appendChild(letraDiv);
  }

  document.getElementById("tentativas").appendChild(linha);
}

// ------------------ Enter funciona ------------------
document.getElementById("tentativa").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    verificar();
  }
});

// ------------------ Confete ------------------
function soltarConfete() {
  const confeteContainer = document.getElementById("confete");}
  for (let i = 0; i < 80; i++){
    const confete = document.createElement("div");
    confete.classList.add("confete-piece");
    confete.style.left = Math.random() * 100 + "vw";
    confete.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    confete.style.animationDuration = (Math.random() * 2 + 3) + "s";
    confeteContainer.appendChild(confete);
    setTimeout(() => confete.remove(), 3000);
}