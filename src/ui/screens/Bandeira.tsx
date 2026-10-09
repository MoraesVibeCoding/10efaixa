import { t } from '../../i18n';

// v2.62: a bandeira da seleção do jogador, em desenho simples (símbolo nacional, sem brasão nem escudo de federação),
// com a sigla ao lado. Decorativa: o nome do país vai no texto escondido para o leitor de tela.
const W = 21;
const H = 14;

function Brasil() {
  return <><rect width={W} height={H} fill="#009C3B" /><path d="M10.5 1.6 19.4 7l-8.9 5.4L1.6 7z" fill="#FFDF00" /><circle cx="10.5" cy="7" r="3.1" fill="#002776" /></>;
}
function Italia() {
  return <><rect width={7} height={H} fill="#009246" /><rect x={7} width={7} height={H} fill="#FFFFFF" /><rect x={14} width={7} height={H} fill="#CE2B37" /></>;
}
function Portugal() {
  return <><rect width={8.4} height={H} fill="#046A38" /><rect x={8.4} width={12.6} height={H} fill="#DA291C" /></>;
}
function Espanha() {
  return <><rect width={W} height={H} fill="#AA151B" /><rect y={3.5} width={W} height={7} fill="#F1BF00" /></>;
}
function Alemanha() {
  return <><rect width={W} height={4.67} fill="#000000" /><rect y={4.67} width={W} height={4.67} fill="#DD0000" /><rect y={9.33} width={W} height={4.67} fill="#FFCE00" /></>;
}
function Neutra() {
  return <rect width={W} height={H} fill="currentColor" opacity={0.3} />;
}
// uma função por país (a guarda do i18n lê "case" entre JSX como texto solto)
const DESENHOS: Record<string, () => React.ReactElement> = { brasil: Brasil, italia: Italia, portugal: Portugal, espanha: Espanha, alemanha: Alemanha };

export function Bandeira({ pais }: { pais: string }) {
  return (
    <span className="bandeira">
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} aria-hidden="true" focusable="false">{(DESENHOS[pais] ?? Neutra)()}</svg>
      <span aria-hidden="true">{t(`ui.sigla.${pais}`)}</span>
      <span className="sr-only">{t('ui.decisao.selecao', { pais: t(`ui.pais.${pais}`) })}</span>
    </span>
  );
}
