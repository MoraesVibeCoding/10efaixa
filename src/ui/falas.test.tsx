import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { cleanup, render, screen } from '@testing-library/react';
import events from '../i18n/pt-BR/events.json';
import { t } from '../i18n';
import type { MeetingOptions } from '../engine/meetingOptions';
import { comFalas } from './falas';
import { Decision } from './screens/Decision';
import { ResumoTemporada } from './screens/ResumoTemporada';
import { Reuniao } from './screens/Reuniao';

// v2.77 (aprovada pelo usuário em 2026-10-10): o que alguém diz (técnico, treinador, empresário, faixa da torcida) aparece em
// itálico, com aspas curvas; a narração em 2ª pessoa segue em letra normal. Itálico verdadeiro da Archivo, não inclinação falsa.
afterEach(cleanup);

const src = (p: string) => readFileSync(resolve(__dirname, p), 'utf8');

describe('falas em itálico (v2.77)', () => {
  it('comFalas: só o trecho entre aspas curvas vira fala; o resto fica como texto', () => {
    const { container } = render(<p>{comFalas('A faixa dizia: “Aqui não tem traidor”. E pronto.')}</p>);
    const falas = container.querySelectorAll('.fala');
    expect(falas).toHaveLength(1);
    expect(falas[0]!.textContent).toBe('“Aqui não tem traidor”');
    expect(container.textContent).toBe('A faixa dizia: “Aqui não tem traidor”. E pronto.');
    expect(render(<p>{comFalas('Sem fala nenhuma.')}</p>).container.querySelector('.fala')).toBeNull();
  });

  it('todo texto de evento fecha as aspas que abre (senão a fala não é marcada)', () => {
    const open: string[] = [];
    const walk = (o: unknown, path: string) => {
      if (typeof o === 'string') { if ((o.match(/“/g) ?? []).length !== (o.match(/”/g) ?? []).length || /“[^”]*“/.test(o)) open.push(path); return; }
      if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) walk(v, `${path}.${k}`);
    };
    walk(events, 'events');
    expect(open).toEqual([]);
  });

  it('a fala tem itálico verdadeiro e aspas curvas; o itálico da Archivo é carregado', () => {
    expect(src('base.css')).toMatch(/\n\.fala \{[^}]*font-style: italic/);
    expect(src('base.css')).toMatch(/\nq\.fala \{[^}]*quotes: '“' '”'/);
    expect(src('../main.tsx')).toContain("import '@fontsource-variable/archivo/wght-italic.css';");
  });

  it('decisão: a citação dentro da história vira fala', () => {
    render(<Decision eventId="proposta-rival" age={24} progress={0.4} player={{ name: 'Zé', position: 'meia', clubId: 'flamengo', overall: 60, titles: [], role: 'composicao', monthlySalary: { amount: 4_000, currency: 'BRL' } }} scene={{ src: 'c.webp', alt: 'cena' }} />);
    const fala = document.querySelector('.decisao__historia .fala');
    expect(fala?.textContent).toBe('“Aqui não tem traidor”');
  });

  it('resumo da temporada: o comentário do técnico é fala', () => {
    render(<ResumoTemporada resumo={{ year: 2030, age: 22, clubId: 'santos', division: 'BRA-A', partidas: 34, gols: 9, assistencias: 5, semSofrerGol: 0, goleiro: false, overallDe: 70, overallPara: 74, pct: 6, mudancas: [], titulos: [], comentario: { evolucao: 'grande', minutos: 'muitos', destaque: null, titulo: false }, sinais: [] }} onClose={() => {}} />);
    const fala = screen.getByTestId('comentario');
    expect(fala.tagName).toBe('Q');
    expect(fala).toHaveClass('fala');
  });

  it('reunião: o nome de quem fala em letra normal, a fala em itálico', () => {
    const ideias: MeetingOptions = {
      obvia: { proposal: { main: 'fisico', secondary: 'passe' }, agrado: 'muito' },
      mescla: { proposal: { main: 'fisico', secondary: 'drible' }, agrado: 'possivel' },
      ousada: { proposal: { main: 'drible', secondary: 'finalizacao' }, agrado: 'pouco' },
    };
    render(<Reuniao ideias={ideias} semestre={1} age={20} progress={0.2} player={{ name: 'Pedro', position: 'meia', clubId: 'santos', overall: 60, titles: [], role: 'disputa', monthlySalary: { amount: 4_000, currency: 'BRL' } }} scene={{ src: 'c.webp', alt: 'cena' }} onChoose={() => {}} />);
    const fala = document.querySelector('.reuniao__fala q.fala');
    expect(fala?.textContent).toBe(t('ui.reuniao.fala.1', { nome: 'Pedro' }));
    expect(document.querySelector('.reuniao__fala strong')).toHaveTextContent(t('ui.reuniao.treinador'));
  });
});
