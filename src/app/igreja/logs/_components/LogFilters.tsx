import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

type Props = { search: string; module: string; level: string; modules: string[]; onSearchChange: (value: string) => void; onModuleChange: (value: string) => void; onLevelChange: (value: string) => void; onClear: () => void };

export default function LogFilters({ search, module, level, modules, onSearchChange, onModuleChange, onLevelChange, onClear }: Props) {
  return <section className="log-filters glass-panel" aria-label="Filtros dos registros">
    <label className="log-search"><SearchRoundedIcon /><input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Buscar ação, usuário ou descrição" /></label>
    <label><span>Módulo</span><select value={module} onChange={(event) => onModuleChange(event.target.value)}><option value="">Todos os módulos</option>{modules.map((item) => <option key={item}>{item}</option>)}</select></label>
    <label><span>Tipo</span><select value={level} onChange={(event) => onLevelChange(event.target.value)}><option value="">Todos os tipos</option><option value="info">Consulta/alteração</option><option value="success">Sucesso</option><option value="warning">Atenção</option><option value="danger">Erro</option></select></label>
    <button type="button" onClick={onClear}><FilterAltRoundedIcon /> Limpar filtros</button>
  </section>;
}
