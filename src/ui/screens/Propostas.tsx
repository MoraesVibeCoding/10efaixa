import { Fragment, useEffect, useRef, useState } from 'react';
import { STAY, RAISE, RENEW, acceptChoice, forceChoice, loveChoice, negotiateChoice, type CurrentClubView, type ProposalView } from '../../engine/proposals';
import { t } from '../../i18n';
import { Career as CareerDrawer, CenaFoto, PaginaCabecalho, PlayerBox, TRANSITION, type DecisionProps } from './Decision';
import '../folha.css';
import { Emblema } from './Emblema';
import { currentText, money, proposalText, type ChangeText } from './proposalText';
import './Propostas.css';

// T28k (SPEC 6.12, v2.54): tela de contratos no desenho aprovado: o card do jogador (o de sempre), cartões selecionáveis (o clube atual
// primeiro: "Renovação" com o contrato no fim, "Seu time atual" fora disso) e "Confirmar escolha". Salário por mês com %, valor projetado
const ATUAL = 'atual';
type Modo = 'aceitar' | 'negociar' | 'forcar' | 'amor' | 'renovar' | 'aumento' | 'naoRenovar';

export interface PropostasProps {
  propostas: ProposalView[]; atual?: CurrentClubView;
  podeFicar: boolean; podeForcar?: boolean; podeRenovar?: boolean;
  /** v2.64: a decisão de empréstimo: o cartão do destino só se aceita ("ir emprestado"); o atual é "ficar e brigar por espaço". */
  emprestimo?: boolean;
  player: DecisionProps['player']; age: number; progress: number; scene: DecisionProps['scene']; anterior?: DecisionProps['anterior'];
  /** v2.81 (Álbum): a linha da página, como na decisão. */
  pagina?: DecisionProps['pagina'];
  onChoose: (choice: string) => void;
}

function Variacao({ c }: { c: ChangeText | null }) {
  return c ? <span className={`propostas__var propostas__var--${c.sentido}`}>{c.texto}</span> : null;
}

function Estrelas({ n, nivel }: { n: number; nivel: string }) {
  return (
    <span className="propostas__tag">
      <span aria-hidden="true" className="propostas__estrelas">{'★'.repeat(n)}{'☆'.repeat(7 - n)}</span>
      <span>{nivel}</span>
    </span>
  );
}

export function Propostas({ propostas, atual, podeFicar, podeForcar = false, podeRenovar = false, emprestimo = false, player, age, progress, scene, anterior, pagina, onChoose }: PropostasProps) {
  const [picked, setPicked] = useState(null as string | null);
  const [modo, setModo] = useState(null as Modo | null);
  const [career, setCareer] = useState(false);
  const opener = useRef(null as HTMLButtonElement | null);
  const title = useRef(null as HTMLHeadingElement | null);
  // v2.81: a folha entra deslizando de baixo; o foco não rola a página até a posição de entrada dela
  useEffect(() => { title.current?.focus({ preventScroll: true }); }, []);
  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !career) opener.current?.focus();
    wasOpen.current = career;
  }, [career]);
  useEffect(() => {
    if (!career) return undefined;
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setCareer(false); }
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); };
  }, [career]);
  const tela = emprestimo ? 'emprestimo' : 'proposta';
  const showAtual = podeFicar && atual !== undefined;
  const proposal = propostas.find((p) => p.clubId === picked);
  const modos: Modo[] = picked === ATUAL
    ? (podeRenovar ? ['renovar', 'aumento', 'naoRenovar'] : [])
    : proposal && emprestimo ? []
    : proposal ? ['aceitar', 'negociar', ...(podeForcar ? ['forcar' as const] : []), ...(proposal.marca === 'coracao' ? ['amor' as const] : [])] : [];

  function choose(id: string) {
    setPicked(id);
    setModo(id === ATUAL ? (podeRenovar ? 'renovar' : null) : 'aceitar');
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!picked) return;
    if (picked === ATUAL) {
      onChoose(modo === 'renovar' ? RENEW : modo === 'aumento' ? RAISE : STAY);
      return;
    }
    const id = picked;
    onChoose(modo === 'negociar' ? negotiateChoice(id) : modo === 'forcar' ? forceChoice(id) : modo === 'amor' ? loveChoice(id) : acceptChoice(id));
  }
  const dica = modo === 'negociar' ? t('ui.proposta.dicaNegociar') : modo === 'forcar' ? t('ui.proposta.dicaForcar')
    : modo === 'amor' ? t('ui.proposta.dicaAmor') : modo === 'aumento' ? t('ui.proposta.dicaAumento') : modo === 'naoRenovar' ? t('ui.proposta.dicaNaoRenovar') : null;

  function detail() {
    return (
          <section className="propostas__detalhe" aria-label={t('ui.proposta.detalhe')} aria-live="polite">
            {emprestimo && picked === ATUAL && (
              <>
                <p><strong>{t('ui.emprestimo.modo.ficar')}</strong></p>
                <p>{t('ui.emprestimo.ficar')}</p>
              </>
            )}
            {emprestimo && picked !== ATUAL && proposal && (
              <>
                <p>{t('ui.emprestimo.duracao')}</p>
                <p>{proposalText(proposal).minutos}</p>
                <p><strong>{t('ui.emprestimo.modo.ir')}</strong></p>
                <p>{t('ui.emprestimo.ir')}</p>
              </>
            )}
            {!emprestimo && picked === ATUAL && atual && (
              <>
                <p>{currentText(atual).restam}</p>
                {podeRenovar && atual.renovacao && atual.aumento && (
                  <div className="propostas__modos" role="radiogroup" aria-label={t('ui.proposta.detalhe')}>
                    {modos.map((m) => {
                      const r = m === 'renovar' ? atual.renovacao : m === 'aumento' ? atual.aumento : null;
                      return (
                        <label key={m} className={modo === m ? 'propostas__modo propostas__modo--marcado' : 'propostas__modo'}>
                          <input type="radio" name="modo" className="sr-only" checked={modo === m} onChange={() => { setModo(m); }} />
                          <span>{t(`ui.proposta.modo.${m}`)}{r && ` · ${t('ui.proposta.salarioMes', { valor: money(r.salarioMensal, atual.currency) })}`}</span>
                          {r && <Variacao c={r.salarioPct ? { texto: t(`ui.proposta.pct.${r.salarioPct.sentido}`, { pct: Math.abs(r.salarioPct.pct) }), sentido: r.salarioPct.sentido } : null} />}
                        </label>
                      );
                    })}
                  </div>
                )}
              </>
            )}
            {!emprestimo && picked !== ATUAL && proposal && (
              <>
                <p>{proposalText(proposal).salario}</p>
                <p>{proposalText(proposal).contrato}</p>
                <p>{proposalText(proposal).minutos}</p>
                <p>{t('ui.proposta.bonus')}</p>
                {proposalText(proposal).aviso && <p className="propostas__aviso">{proposalText(proposal).aviso}</p>}
                <div className="propostas__modos" role="radiogroup" aria-label={t('ui.proposta.detalhe')}>
                  {modos.map((m) => (
                    <label key={m} className={modo === m ? 'propostas__modo propostas__modo--marcado' : 'propostas__modo'}>
                      <input type="radio" name="modo" className="sr-only" checked={modo === m} onChange={() => { setModo(m); }} />
                      <span>{t(`ui.proposta.modo.${m}`)}</span>
                    </label>
                  ))}
                </div>
              </>
            )}
            {dica && <p className="propostas__dica">{dica}</p>}
          </section>
    );
  }
  return (
    <main className="decisao propostas" style={TRANSITION} data-tema="claro" data-evento={emprestimo ? 'emprestimo' : 'proposta-clube'}>
      <PaginaCabecalho pagina={pagina} progress={progress} age={age} inert={career} />
      <PlayerBox player={player} age={age} anterior={anterior} open={career} opener={opener} onOpen={() => { setCareer(true); }} inert={career} />
      {/* v2.81 (Álbum): a cena é uma foto colada na página, embaixo do card do jogador; escurece sob a folha */}
      <CenaFoto scene={scene} inert={career} atras />
      {/* v2.81 (Álbum): os cartões sobem numa folha por cima da página da história */}
      <form className="decisao__painel propostas__painel folha folha--pagina" onSubmit={submit} inert={career} noValidate>
        <p className="propostas__sala">{t(`ui.${tela}.sala`)}</p>
        <h1 className="decisao__titulo" ref={title} tabIndex={-1}>{t(`ui.${tela}.titulo`)}</h1>
        <p className="propostas__apoio">{t(`ui.${tela}.apoio`)}</p>
        {player.etiquetas?.[0] && <p className="propostas__contexto">{t(`ui.proposta.contexto.${player.etiquetas[0]}`)}</p>}
        <div className="propostas__lista" role="group" aria-label={t('ui.proposta.cartoes')}>
          {showAtual && (() => {
            const x = currentText(atual);
            return (
              <>
              <label className={picked === ATUAL ? 'propostas__item propostas__item--marcado' : 'propostas__item'}>
                <input type="radio" name="cartao" className="sr-only" checked={picked === ATUAL} onChange={() => { choose(ATUAL); }} />
                <span className="propostas__topo">
                  <Emblema clubId={atual.clubId} size={28} />
                  <span className="propostas__nome"><strong className="propostas__clube">{x.clube}</strong><span className="propostas__liga">{x.liga}</span></span>
                  <span className="propostas__selo">{t(podeRenovar ? 'ui.proposta.selo.renovacao' : 'ui.proposta.selo.atual')}</span>
                </span>
                <span className="propostas__financeiro">
                  <span>{x.salarioMes}</span>
                  <span>{x.valorProj} <Variacao c={x.valorVar} /></span>
                </span>
                <span className="propostas__tags"><Estrelas n={x.estrelas} nivel={x.nivel} /><span className="propostas__tag">{x.papel}</span></span>
              </label>
              {picked === ATUAL && detail()}
              </>
            );
          })()}
          {propostas.map(function card(p) {
            const x = proposalText(p);
            const on = picked === p.clubId;
            return (
              <Fragment key={p.clubId}>
              <label className={on ? 'propostas__item propostas__item--marcado' : 'propostas__item'}>
                <input type="radio" name="cartao" className="sr-only" checked={on} onChange={() => { choose(p.clubId); }} />
                {x.marca && <span className="propostas__marca">{x.marca}</span>}
                <span className="propostas__topo">
                  <Emblema clubId={p.clubId} size={28} />
                  <span className="propostas__nome"><strong className="propostas__clube">{x.clube}</strong><span className="propostas__liga">{x.liga}</span></span>
                  <span className="propostas__selo">{t(emprestimo ? 'ui.emprestimo.selo' : 'ui.proposta.selo.nova')}</span>
                </span>
                <span className="propostas__financeiro">
                  <span>{x.salarioMes} <Variacao c={x.salarioVar} /></span>
                  <span>{x.valorProj} <Variacao c={x.valorVar} /></span>
                </span>
                <span className="propostas__tags">
                  <Estrelas n={x.estrelas} nivel={x.nivel} />
                  <span className="propostas__tag">{x.papel}</span>
                  {x.minutosVs && <span className={`propostas__tag propostas__tag--${p.minutosVs}`}>{x.minutosVs}</span>}
                </span>
              </label>
              {on && detail()}
              </Fragment>
            );
          })}
        </div>
        <button type="submit" className="decisao__confirmar propostas__confirmar" disabled={picked === null}>{t('ui.proposta.confirmar')}</button>
      </form>
      {career && <CareerDrawer player={player} onClose={() => { setCareer(false); }} />}
    </main>
  );
}
