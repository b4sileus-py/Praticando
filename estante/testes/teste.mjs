// Teste de comportamento da Estante (Playwright + Microsoft Edge instalado).
// Uso: npm i playwright-core  ->  node teste.mjs <pasta-para-capturas>
import { chromium } from 'playwright-core';
const URL = new URL('../index.html', import.meta.url).href;
const SHOTS = process.argv[2];
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
let falhas = 0; const ok = (c, m) => { console.log((c ? 'ok    ' : 'FALHA ') + m); if (!c) falhas++; };
const erros = [];
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'light' });
const p = await ctx.newPage(); p.on('pageerror', e => erros.push(e.message)); p.on('console', m => m.type()==='error' && erros.push(m.text()));
await p.goto(URL);
ok(await p.locator('.estante-vazia').isVisible(), 'estante vazia mostra convite para agir');
await p.screenshot({ path: SHOTS + '/1-vazia-claro.png' });
await p.getByRole('button', { name: 'Ver com exemplos' }).click();
ok(await p.locator('.lombada').count() === 8, '8 lombadas depois dos exemplos');
ok((await p.textContent('#contagem')).includes('8 de 8'), 'contagem 8 de 8');
ok(await p.locator('.pendencia').count() === 1, 'livro incompleto (sem autor) aparecem com pendência âmbar');
await p.waitForTimeout(1500);
await p.screenshot({ path: SHOTS + '/2-exemplos-claro.png', fullPage: true });

// filtro com setas (roving tabindex)
await p.getByRole('radio', { name: 'Todos' }).focus(); await p.keyboard.press('ArrowRight');
ok((await p.textContent('#contagem')).includes('2 de 8'), 'seta move filtro para "Quero ler" (2 de 8)');
await p.getByRole('radio', { name: 'Todos' }).click();
await p.fill('#busca', 'zzz');
ok(await p.locator('#sem-resultado').isVisible(), 'busca sem resultado mostra "Limpar filtros"');
await p.click('#btn-limpar-filtros'); ok((await p.textContent('#contagem')).includes('8 de 8'), 'limpar filtros restaura a lista');

// ordenação
await p.click('th[data-col="titulo"] button');
ok(await p.getAttribute('th[data-col="titulo"]', 'aria-sort') === 'ascending', 'ordenar por título marca aria-sort');
ok((await p.locator('#linhas tr .livro-titulo').first().textContent()) === 'Dom Casmurro', 'primeiro em ordem alfabética é Dom Casmurro');

// novo livro: erro de título, pendências, Enter avança
await p.click('#btn-registrar');
ok(await p.locator('#dlg-livro').evaluate(d => d.open), 'formulário abre');
ok(await p.evaluate(() => document.activeElement.id) === 'f-titulo', 'foco inicial no título');
await p.click('#btn-salvar');
ok(await p.locator('#e-titulo').isVisible(), 'salvar sem título mostra erro vermelho');
await p.fill('#f-titulo', 'Livro de teste'); await p.keyboard.press('Enter');
ok(await p.evaluate(() => document.activeElement.id) === 'f-autor', 'Enter avança para o próximo campo');
ok(await p.locator('#f-fim').isDisabled(), 'data de término desabilitada quando "Lendo"');
await p.fill('#f-paginas', '100'); await p.fill('#f-atual', '150');
ok(await p.locator('#e-atual').isVisible(), 'página atual maior que o total é erro');
await p.fill('#f-atual', '40');
ok(!(await p.locator('#e-atual').isVisible()), 'erro some ao corrigir');
ok(await p.locator('#resumo-pendencias').isVisible(), 'resumo de pendências aparece (falta autor)');
if (SHOTS) await p.screenshot({ path: SHOTS + '/3-formulario-claro.png' });
await p.click('#btn-salvar');
ok(await p.locator('#dlg-confirmar').evaluate(d => d.open), 'pendência pede confirmação, não bloqueia');
ok(await p.evaluate(() => document.activeElement.id) === 'c-nao', 'foco inicial no lado seguro ("Voltar e completar")');
await p.getByRole('button', { name: 'Salvar assim mesmo' }).click();
ok(await p.locator('.lombada').count() === 9, 'livro salvo vira a 9ª lombada');
ok((await p.textContent('#toasts')).includes('Livro salvo'), 'toast confirma "Livro salvo na estante."');

// persistência
await p.reload();
ok(await p.locator('.lombada').count() === 9, 'livros continuam depois de recarregar');

// descartar alterações com Esc
await p.locator('.lombada').first().click();
await p.fill('#f-autor', 'Outro autor'); await p.keyboard.press('Escape');
ok(await p.locator('#dlg-confirmar').evaluate(d => d.open), 'Esc com alterações pergunta antes de descartar');
await p.keyboard.press('Escape');
ok(await p.locator('#dlg-livro').evaluate(d => d.open), 'Esc na confirmação volta à edição (lado seguro)');
await p.click('#btn-cancelar'); await p.getByRole('button', { name: 'Descartar alterações' }).click();
ok(!(await p.locator('#dlg-livro').evaluate(d => d.open)), 'descartar fecha o formulário');

// excluir
await p.getByRole('button', { name: 'Editar Livro de teste' }).click();
await p.click('#btn-excluir');
ok(await p.evaluate(() => document.activeElement.textContent) === 'Manter livro', 'confirmação de exclusão foca "Manter livro"');
await p.getByRole('button', { name: 'Excluir livro' }).last().click();
ok(await p.locator('.lombada').count() === 8, 'livro excluído');

// tema escuro
await p.click('#btn-tema');
ok(await p.getAttribute('html', 'data-theme') === 'dark', 'botão troca para o tema escuro');
ok((await p.textContent('#btn-tema')) === 'Tema claro', 'rótulo mostra o destino do clique');
await p.screenshot({ path: SHOTS + '/4-exemplos-escuro.png', fullPage: true });

// tela estreita
await p.setViewportSize({ width: 380, height: 800 });
const larg = await p.evaluate(() => document.documentElement.scrollWidth);
ok(larg <= 380, 'sem rolagem horizontal da página a 380px (scrollWidth ' + larg + ')');
await p.screenshot({ path: SHOTS + '/5-estreito-escuro.png', fullPage: true });
await p.click('#btn-tema');
await p.screenshot({ path: SHOTS + '/6-estreito-claro.png', fullPage: true });

ok(erros.length === 0, 'sem erros no console' + (erros.length ? ': ' + erros.join(' | ') : ''));
await b.close();
console.log(falhas ? `\n${falhas} falha(s)` : '\nTodos os testes passaram');
