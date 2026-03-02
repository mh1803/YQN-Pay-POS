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

  return (
    <>
      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Table</p>
            <h2>Assign the order</h2>
          </div>
        </div>
        <button type="button" className="table-trigger" onClick={() => setIsOpen(true)}>
          <div>
            <strong>{selectedTableName || 'Choose a table'}</strong>
            <p className="muted">
              {selectedTableId ? 'Tap to change table or view statuses.' : 'Open the table list before building the sale.'}
            </p>
          </div>
          <span className="badge">View Tables</span>
        </button>
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
                <h2 id="table-modal-title">Choose the active table</h2>
              </div>
              <button type="button" className="secondary-button" onClick={() => setIsOpen(false)}>
                Close
              </button>
            </div>
            <div className="table-grid">
              {tables.map((table) => (
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
