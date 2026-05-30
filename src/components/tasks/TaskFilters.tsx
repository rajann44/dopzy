import { useState } from 'react';
import { Search, SlidersHorizontal, X, Tag, MapPin, DollarSign } from 'lucide-react';
import type { TaskFilters } from '../../types';
import { TASK_CATEGORIES, AUSTRALIAN_CITIES, STATUS_LABELS } from '../../utils/constants';
import { useTranslation } from '../../context/LanguageContext';

interface TaskFiltersProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
  showStatus?: boolean;
}

export function TaskFiltersBar({ filters, onChange, showStatus = false }: TaskFiltersProps) {
  const { t } = useTranslation();
  const hasActiveFilters = Object.keys(filters).some(
    (key) => {
      const val = filters[key as keyof TaskFilters];
      return val !== undefined && val !== '' && val !== 0;
    }
  );

  const [isExpanded, setIsExpanded] = useState(hasActiveFilters);

  const update = (key: keyof TaskFilters, value: string | number | undefined) => {
    onChange({ ...filters, [key]: value || undefined });
  };

  const clear = () => {
    onChange({});
    setIsExpanded(false);
  };

  const activeFiltersCount = Object.keys(filters).filter(
    (k) => filters[k as keyof TaskFilters] !== undefined && filters[k as keyof TaskFilters] !== ''
  ).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Main Search Row */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-secondary-mid)',
              opacity: 0.8,
            }}
          />
          <input
            type="text"
            placeholder={t('filters.search_prompt')}
            value={filters.search ?? ''}
            onChange={(e) => update('search', e.target.value)}
            className="form-input"
            style={{
              paddingLeft: '44px',
              paddingRight: '16px',
              height: '46px',
              borderRadius: 'var(--radius-full)',
              border: '1.5px solid var(--color-outline-variant)',
              fontSize: 'var(--text-body-md)',
              fontWeight: 500,
              background: 'var(--color-surface-container-lowest)',
              boxShadow: 'none',
              transition: 'all var(--transition-fast)'
            }}
            aria-label="Search tasks"
          />
          {filters.search && (
            <button
              onClick={() => update('search', '')}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-on-surface-variant)',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filters Toggle Button */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`btn ${isExpanded || hasActiveFilters ? 'btn-primary' : 'btn-outlined'}`}
          style={{
            height: '46px',
            padding: '0 var(--space-5)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderRadius: 'var(--radius-full)',
            transition: 'all var(--transition-fast)',
            borderColor: isExpanded || hasActiveFilters ? 'var(--color-primary)' : 'var(--color-outline-variant)',
          }}
        >
          <SlidersHorizontal size={16} />
          <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 700 }}>{t('filters.toggle')}</span>
          {activeFiltersCount > 0 && (
            <span style={{
              background: isExpanded || hasActiveFilters ? 'var(--color-secondary)' : 'var(--color-outline)',
              color: isExpanded || hasActiveFilters ? 'var(--color-on-secondary)' : 'var(--color-on-surface)',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: 700
            }}>
              {activeFiltersCount}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clear}
            className="btn btn-ghost"
            style={{
              height: '46px',
              borderRadius: 'var(--radius-full)',
              padding: '0 var(--space-4)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--color-on-surface-variant)',
            }}
          >
            <X size={14} /> {t('filters.reset')}
          </button>
        )}
      </div>

      {/* Expandable Advanced Filters Drawer */}
      {isExpanded && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-4)',
          background: 'var(--color-surface-container-low)',
          padding: 'var(--space-5)',
          borderRadius: 'var(--radius-lg)',
          border: '1.5px solid var(--color-outline-variant)',
        }}>
          {/* Category Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-secondary-mid)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Tag size={12} /> {t('filters.category')}
            </label>
            <select
              value={filters.category ?? ''}
              onChange={(e) => update('category', e.target.value)}
              className="form-select"
              style={{
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-outline-variant)',
                fontSize: 'var(--text-body-sm)',
                height: '38px',
                padding: '0 var(--space-3)'
              }}
              aria-label="Filter by category"
            >
              <option value="">{t('filters.all_categories')}</option>
              {TASK_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Location/City Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-secondary-mid)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={12} /> {t('filters.city')}
            </label>
            <select
              value={filters.city ?? ''}
              onChange={(e) => update('city', e.target.value)}
              className="form-select"
              style={{
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-outline-variant)',
                fontSize: 'var(--text-body-sm)',
                height: '38px',
                padding: '0 var(--space-3)'
              }}
              aria-label="Filter by city"
            >
              <option value="">{t('filters.all_cities')}</option>
              {AUSTRALIAN_CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Status Filter (conditional) */}
          {showStatus && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-secondary-mid)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {t('filters.status')}
              </label>
              <select
                value={filters.status ?? ''}
                onChange={(e) => update('status', e.target.value)}
                className="form-select"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-outline-variant)',
                  fontSize: 'var(--text-body-sm)',
                  height: '38px',
                  padding: '0 var(--space-3)'
                }}
                aria-label="Filter by status"
              >
                <option value="">{t('filters.all_statuses')}</option>
                {Object.entries(STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          )}

          {/* Budget Range Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-secondary-mid)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <DollarSign size={12} /> {t('filters.budget_range')}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="number"
                placeholder={t('filters.min')}
                value={filters.budgetMin ?? ''}
                onChange={(e) => update('budgetMin', e.target.value ? Number(e.target.value) : undefined)}
                className="form-input"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-outline-variant)',
                  fontSize: 'var(--text-body-sm)',
                  height: '38px',
                  padding: '0 var(--space-3)',
                  flex: 1
                }}
                min={0}
                aria-label="Minimum budget"
              />
              <span style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--text-body-sm)', fontWeight: 600 }}>to</span>
              <input
                type="number"
                placeholder={t('filters.max')}
                value={filters.budgetMax ?? ''}
                onChange={(e) => update('budgetMax', e.target.value ? Number(e.target.value) : undefined)}
                className="form-input"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-outline-variant)',
                  fontSize: 'var(--text-body-sm)',
                  height: '38px',
                  padding: '0 var(--space-3)',
                  flex: 1
                }}
                min={0}
                aria-label="Maximum budget"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
