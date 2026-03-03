import { useState } from 'react';
import { TableOption } from '../types/state';

interface TableSelectorProps {
  tables: TableOption[];
  selectedTableId: string;
  selectedTableName: string;
  onSelectTable: (tableId: string) => void;
}

export function TableSelector({ tables, selectedTableId, selectedTableName, onSelectTable }: TableSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dineInTables = tables.filter((table) => table.id !== 'takeout');
  const isTableService = selectedTableId !== '' && selectedTableId !== 'takeout';

  return (
    <>
      <section className="panel order-source-panel">
        <div className="section-heading compact-section-heading">
          <div>
            <h2>Order Type</h2>
          </div>
        </div>
        <div className="order-source-toggle" aria-label="Order type">
          <button
            type="button"
            className={!isTableService ? 'order-source-button active' : 'order-source-button'}
            onClick={() => onSelectTable('takeout')}
            aria-pressed={!isTableService}
          >
            <span className="order-source-title">Takeout</span>
          </button>
          <button
            type="button"
            className={isTableService ? 'order-source-button active' : 'order-source-button'}
            onClick={() => setIsOpen(true)}
            aria-pressed={isTableService}
          >
            <span className="order-source-title">
              Table
              {isTableService ? <span className="order-source-detail">({selectedTableName})</span> : null}
            </span>
          </button>
        </div>
      </section>

      {isOpen ? (
        <div className="table-modal-backdrop" role="presentation" onClick={() => setIsOpen(false)}>
          <section
            className="panel table-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="table-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="section-heading">
              <div>
                <p className="eyebrow">Tables</p>
                <h2 id="table-modal-title">Choose a table</h2>
              </div>
              <button
                type="button"
                className="modal-close-button"
                onClick={() => setIsOpen(false)}
                aria-label="Close dialog"
              >
                X
              </button>
            </div>
            <div className="table-grid">
              {dineInTables.map((table) => (
                <button
                  key={table.id}
                  type="button"
                  className={selectedTableId === table.id ? 'table-tile active' : 'table-tile'}
                  onClick={() => {
                    onSelectTable(table.id);
                    setIsOpen(false);
                  }}
                >
                  <strong>{table.name}</strong>
                  <span className={`table-status table-status-${table.status}`}>{table.status}</span>
                  <span className="muted">{table.seats} seats</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
