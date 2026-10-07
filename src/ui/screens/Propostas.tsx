import { useEffect, useRef } from 'react';
import { STAY, acceptChoice, forceChoice, loveChoice, negotiateChoice, type ProposalView } from '../../engine/proposals';
import { t } from '../../i18n';
import { clubName } from './clubText';
import { Emblema } from './Emblema';
import { proposalText } from './proposalText';
import './Creation.css';
import './Propostas.css';

// T28d (SPEC 6.12, v2.50): propostas de clube da janela de transferências. Até 3 propostas e "Ficar no clube" (só com clube
// para ficar). Minutos e nível do clube só em palavras. Um toque decide, como as outras decisões do ritmo Rápido.
export function Propostas({ propostas, podeFicar, podeForcar = false, onChoose }: { propostas: ProposalView[]; podeFicar: boolean; podeForcar?: boolean; onChoose: (choice: string) => void }) {
  const title = useRef(null as HTMLHeadingElement | null);
  useEffect(() => { title.current?.focus(); }, []);
  return (
    <main className="criacao propostas">
      <div className="criacao__form">
        <header className="criacao__topo">
          <h1 className="criacao__titulo" ref={title} tabIndex={-1}>{t('ui.proposta.titulo')}</h1>
        </header>
        <div className="criacao__passo">
          <ul className="propostas__lista">
            {propostas.map(function card(p) {
              const x = proposalText(p);
              const { prep, nome } = clubName(p.clubId);
              return (
                <li key={p.clubId} className="propostas__item">
                  {x.marca && <p className="propostas__marca">{x.marca}</p>}
                  <h2 className="propostas__clube"><Emblema clubId={p.clubId} size={28} />{x.clube}</h2>
                  <p className="propostas__liga">{x.liga}</p>
                  <div className="propostas__detalhes">
                    <span>{x.salario}</span>
                    <span>{x.contrato}</span>
                    <span>{x.papel}</span>
                    <span>{x.minutos}</span>
                    <span>{x.nivel}</span>
                  </div>
                  {x.aviso && <p className="propostas__aviso">{x.aviso}</p>}
                  <button type="button" className="criacao__botao criacao__botao--principal" aria-label={t('ui.proposta.aceitarDe', { prep, clube: nome })}
                    onClick={function accept() { onChoose(acceptChoice(p.clubId)); }}>
                    {t('ui.proposta.aceitar')}
                  </button>
                  <button type="button" className="criacao__botao" aria-label={t('ui.proposta.negociarDe', { prep, clube: nome })}
                    onClick={function negotiate() { onChoose(negotiateChoice(p.clubId)); }}>
                    {t('ui.proposta.negociar')}
                  </button>
                  {podeForcar && (
                    <button type="button" className="criacao__botao" aria-label={t('ui.proposta.forcarDe', { prep, clube: nome })}
                      onClick={function force() { onChoose(forceChoice(p.clubId)); }}>
                      {t('ui.proposta.forcar')}
                    </button>
                  )}
                  {p.marca === 'coracao' && (
                    <>
                      <button type="button" className="criacao__botao" aria-label={t('ui.proposta.porAmorDe', { prep, clube: nome })}
                        onClick={function love() { onChoose(loveChoice(p.clubId)); }}>
                        {t('ui.proposta.porAmor')}
                      </button>
                      <p className="criacao__dica">{t('ui.proposta.dicaAmor')}</p>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="criacao__dica">{t('ui.proposta.legenda')}</p>
          <p className="criacao__dica">{t('ui.proposta.dicaNegociar')}</p>
          {podeForcar && <p className="criacao__dica">{t('ui.proposta.dicaForcar')}</p>}
        </div>
        {podeFicar && (
          <footer className="criacao__acoes propostas__acoes">
            <button type="button" className="criacao__botao" onClick={function stay() { onChoose(STAY); }}>{t('ui.proposta.ficar')}</button>
          </footer>
        )}
      </div>
    </main>
  );
}
