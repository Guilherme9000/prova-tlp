/* ================================================================
   script.js  –  3º Trimestre  (ttt1 · ttt2 · ttt3)
   Partilhado pelas três páginas via <script src="script.js">
   ================================================================ */

/* ────────────────────────────────────────────────────────────────
   1. ARMAZENAMENTO  (localStorage para persistir entre páginas)
   ──────────────────────────────────────────────────────────────── */

function guardarAlunos(lista) {
    localStorage.setItem('alunos_3trim', JSON.stringify(lista));
}

function carregarAlunos() {
    var dados = localStorage.getItem('alunos_3trim');
    return dados ? JSON.parse(dados) : [];
}

/* ────────────────────────────────────────────────────────────────
   2. CÁLCULO DE SITUAÇÃO
   ──────────────────────────────────────────────────────────────── */

function calcularSituacao(media) {
    if (media >= 10) return 'aprovado';
    if (media >= 7)  return 'recurso';
    return 'reprovado';
}

function labelSituacao(s) {
    if (s === 'aprovado')  return 'Aprovado';
    if (s === 'reprovado') return 'Reprovado';
    return 'Recurso';
}

/* ────────────────────────────────────────────────────────────────
   3. UTILITÁRIOS DE VALIDAÇÃO
   ──────────────────────────────────────────────────────────────── */

function mostrarErro(idCampo, mensagem) {
    var campo = document.getElementById(idCampo);
    var span  = document.getElementById('err-' + idCampo);
    if (!campo || !span) return;
    campo.classList.add('campo-erro');
    campo.classList.remove('campo-ok');
    span.textContent = mensagem;
}

function limparErro(idCampo) {
    var campo = document.getElementById(idCampo);
    var span  = document.getElementById('err-' + idCampo);
    if (!campo || !span) return;
    campo.classList.remove('campo-erro');
    if (campo.value.trim() !== '') campo.classList.add('campo-ok');
    span.textContent = '';
}

/* ────────────────────────────────────────────────────────────────
   4. TTT1 – FORMULÁRIO
   ──────────────────────────────────────────────────────────────── */

if (document.getElementById('formAluno')) {

    /* Validação em tempo real: campos de texto não aceitam dígitos */
    ['nome', 'apelido'].forEach(function(id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', function() {
            var v = this.value;
            if (/[0-9]/.test(v)) {
                mostrarErro(id, 'Este campo não aceita números.');
            } else {
                limparErro(id);
            }
        });
    });

    /* Validação em tempo real: campo número só aceita dígitos */
    var elNumero = document.getElementById('numero');
    if (elNumero) {
        elNumero.addEventListener('input', function() {
            var v = this.value.trim();
            if (v !== '' && !/^\d+$/.test(v)) {
                mostrarErro('numero', 'Apenas dígitos são permitidos (sem letras).');
            } else {
                limparErro('numero');
            }
        });
    }

    /* Validação em tempo real: campos de nota só aceitam números 0-20 */
    ['n1', 'n2', 'n3', 'n4'].forEach(function(id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', function() {
            var v = this.value.trim();
            if (v === '') { limparErro(id); return; }
            /* Verifica se tem letras */
            if (/[a-zA-Z]/.test(v)) {
                mostrarErro(id, 'Nota não pode conter letras. Use um número.');
                return;
            }
            /* Verifica se é número válido */
            if (isNaN(parseFloat(v)) || !/^\d*\.?\d*$/.test(v)) {
                mostrarErro(id, 'Valor inválido. Insira um número.');
                return;
            }
            var num = parseFloat(v);
            if (num < 0 || num > 20) {
                mostrarErro(id, 'A nota deve ser entre 0 e 20.');
            } else {
                limparErro(id);
            }
        });
    });

    /* Botão Adicionar */
    document.getElementById('btn-adicionar').addEventListener('click', function() {
        var valido = true;

        /* Recolher valores */
        var nome    = document.getElementById('nome').value.trim();
        var apelido = document.getElementById('apelido').value.trim();
        var numero  = document.getElementById('numero').value.trim();
        var turma   = document.getElementById('turma').value;
        var n1 = document.getElementById('n1').value.trim();
        var n2 = document.getElementById('n2').value.trim();
        var n3 = document.getElementById('n3').value.trim();
        var n4 = document.getElementById('n4').value.trim();

        /* --- Validar Nome --- */
        if (nome === '') {
            mostrarErro('nome', 'O nome é obrigatório.'); valido = false;
        } else if (/[0-9]/.test(nome)) {
            mostrarErro('nome', 'O nome não pode conter números.'); valido = false;
        } else { limparErro('nome'); }

        /* --- Validar Apelido --- */
        if (apelido === '') {
            mostrarErro('apelido', 'O apelido é obrigatório.'); valido = false;
        } else if (/[0-9]/.test(apelido)) {
            mostrarErro('apelido', 'O apelido não pode conter números.'); valido = false;
        } else { limparErro('apelido'); }

        /* --- Validar Número --- */
        if (numero === '') {
            mostrarErro('numero', 'O número do aluno é obrigatório.'); valido = false;
        } else if (!/^\d+$/.test(numero)) {
            mostrarErro('numero', 'O número só pode conter dígitos (sem letras).'); valido = false;
        } else { limparErro('numero'); }

        /* --- Validar Turma --- */
        var errTurma = document.getElementById('err-turma');
        if (turma === '') {
            if (errTurma) errTurma.textContent = 'Seleccione uma turma.';
            valido = false;
        } else {
            if (errTurma) errTurma.textContent = '';
        }

        /* --- Validar Notas --- */
        var notasCampos = [
            { id: 'n1', val: n1 },
            { id: 'n2', val: n2 },
            { id: 'n3', val: n3 },
            { id: 'n4', val: n4 }
        ];

        var notasNumericas = [];

        notasCampos.forEach(function(item) {
            if (item.val === '') {
                mostrarErro(item.id, 'A nota é obrigatória.'); valido = false;
            } else if (/[a-zA-Z]/.test(item.val)) {
                mostrarErro(item.id, 'A nota não pode conter letras.'); valido = false;
            } else if (isNaN(parseFloat(item.val))) {
                mostrarErro(item.id, 'Insira um número válido.'); valido = false;
            } else {
                var num = parseFloat(item.val);
                if (num < 0 || num > 20) {
                    mostrarErro(item.id, 'A nota deve ser entre 0 e 20.'); valido = false;
                } else {
                    limparErro(item.id);
                    notasNumericas.push(num);
                }
            }
        });

        if (!valido) return;

        /* --- Criar aluno e guardar --- */
        var media     = (notasNumericas[0] + notasNumericas[1] + notasNumericas[2] + notasNumericas[3]) / 4;
        var situacao  = calcularSituacao(media);

        var aluno = {
            id:       Date.now(),
            nome:     nome,
            apelido:  apelido,
            numero:   numero,
            turma:    turma,
            notas:    notasNumericas,
            media:    media,
            situacao: situacao
        };

        var lista = carregarAlunos();
        lista.push(aluno);
        guardarAlunos(lista);

        /* Limpar formulário */
        ['nome','apelido','numero','n1','n2','n3','n4'].forEach(function(id) {
            var el = document.getElementById(id);
            el.value = '';
            el.classList.remove('campo-ok','campo-erro');
            document.getElementById('err-' + id).textContent = '';
        });
        document.getElementById('turma').value = '';
        if (errTurma) errTurma.textContent = '';

        /* Mostrar mensagem de sucesso */
        var aviso = document.getElementById('aviso-sucesso');
        if (aviso) {
            aviso.style.display = 'block';
            setTimeout(function() { aviso.style.display = 'none'; }, 3500);
        }
    });
}

/* ────────────────────────────────────────────────────────────────
   5. TTT2 – TABELA
   ──────────────────────────────────────────────────────────────── */

if (document.getElementById('tabelaAlunos')) {

    function renderizarTabela() {
        var lista = carregarAlunos();
        var tbody = document.getElementById('tbody-alunos');
        var vazio = document.getElementById('tabela-vazia');
        tbody.innerHTML = '';

        if (lista.length === 0) {
            if (vazio) vazio.style.display = 'block';
            return;
        }
        if (vazio) vazio.style.display = 'none';

        lista.forEach(function(a, i) {
            var tr = document.createElement('tr');
            tr.innerHTML =
                '<td>' + (i + 1) + '</td>' +
                '<td>' + a.nome + '</td>' +
                '<td>' + a.apelido + '</td>' +
                '<td>' + a.numero + '</td>' +
                '<td>' + a.turma + '</td>' +
                '<td>' + a.notas[0].toFixed(1) + '</td>' +
                '<td>' + a.notas[1].toFixed(1) + '</td>' +
                '<td>' + a.notas[2].toFixed(1) + '</td>' +
                '<td>' + a.notas[3].toFixed(1) + '</td>' +
                '<td class="media-cell">' + a.media.toFixed(2) + '</td>' +
                '<td><span class="situacao ' + a.situacao + '">' + labelSituacao(a.situacao) + '</span></td>' +
                '<td><button class="btn-remover" data-id="' + a.id + '">✕ Remover</button></td>';
            tbody.appendChild(tr);
        });

        /* Eventos dos botões remover */
        document.querySelectorAll('.btn-remover').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = parseInt(this.getAttribute('data-id'));
                var listaActual = carregarAlunos();
                var nova = listaActual.filter(function(a) { return a.id !== id; });
                guardarAlunos(nova);
                renderizarTabela();
            });
        });
    }

    renderizarTabela();
}

/* ────────────────────────────────────────────────────────────────
   6. TTT3 – RESULTADOS
   ──────────────────────────────────────────────────────────────── */

if (document.getElementById('cards-resultados')) {

    function renderizarResultados() {
        var lista      = carregarAlunos();
        var grid       = document.getElementById('cards-resultados');
        var semAlunos  = document.getElementById('sem-alunos');

        /* Contadores */
        var aprovados  = lista.filter(function(a) { return a.situacao === 'aprovado';  }).length;
        var reprovados = lista.filter(function(a) { return a.situacao === 'reprovado'; }).length;
        var recurso    = lista.filter(function(a) { return a.situacao === 'recurso';   }).length;

        document.getElementById('total-aprovados').textContent  = aprovados;
        document.getElementById('total-reprovados').textContent = reprovados;
        document.getElementById('total-recurso').textContent    = recurso;

        /* Cards */
        grid.innerHTML = '';

        if (lista.length === 0) {
            if (semAlunos) semAlunos.style.display = 'block';
            return;
        }
        if (semAlunos) semAlunos.style.display = 'none';

        var icones = { aprovado: '✅', reprovado: '❌', recurso: '⚡' };
        lista.forEach(function(a, idx) {
            var div = document.createElement('div');
            div.className = 'aluno-card ' + a.situacao;
            div.style.animationDelay = (idx * 0.06) + 's';
            div.innerHTML =
                '<div class="card-topo">' +
                  '<div class="card-media-val">' + a.media.toFixed(2) + '</div>' +
                  '<div class="card-media-de">/ 20 valores</div>' +
                  '<div class="card-badge">' + icones[a.situacao] + ' ' + labelSituacao(a.situacao) + '</div>' +
                '</div>' +
                '<div class="card-corpo">' +
                  '<div class="card-nome">' + a.nome + ' ' + a.apelido + '</div>' +
                  '<div class="card-info">Turma ' + a.turma + ' · Nº ' + a.numero + '</div>' +
                  '<div class="card-notas">' +
                    a.notas.map(function(n, i) {
                      return '<span class="nota-pill">N' + (i+1) + ': ' + n.toFixed(1) + '</span>';
                    }).join('') +
                  '</div>' +
                '</div>';
            grid.appendChild(div);
        });
    }

    renderizarResultados();
}
