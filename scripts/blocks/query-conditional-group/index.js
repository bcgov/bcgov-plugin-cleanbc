// index.js (replace your file with this)

import { registerBlockType } from '@wordpress/blocks';
import {
  useBlockProps,
  InspectorControls,
  InnerBlocks
} from '@wordpress/block-editor';
import {
  PanelBody,
  SelectControl,
  TextControl,
  Button,
  ToggleControl,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';

const OPERATORS = [
  { label: 'Equals', value: 'equals' },
  { label: 'Not Equals', value: 'notEquals' },
  { label: 'Contains', value: 'contains' },
  { label: 'Starts With', value: 'startsWith' },
  { label: 'Ends With', value: 'endsWith' },
  { label: 'Regex Match', value: 'regex' },
  { label: 'Exists (any value)', value: 'exists' },
  { label: 'Not Exists', value: 'notExists' },
  { label: 'One of (equals any)', value: 'in' },
  { label: 'None of (not equals all)', value: 'notIn' },
  { label: 'Contains any', value: 'containsAny' },
  { label: 'Contains all', value: 'containsAll' },
];

const isMultiValueOp = (op) =>
  ['in', 'notIn', 'containsAny', 'containsAll'].includes(op);

registerBlockType('bcgovcleanbc/query-conditional-group', {
  edit: ({ attributes, setAttributes }) => {
    const { rules = [], logic, invert, caseSensitive, clientSideCheck, hideUntilJs } = attributes;

    const blockProps = useBlockProps({
      className: 'query-conditional-group-block',
      style: hideUntilJs ? { outline: '1px dashed lightgray', outlineOffset: '0.5rem', marginBlock: '1rem' } : undefined
    });

    const updateRule = (index, field, value) => {
      const updated = [...rules];
      updated[index] = { ...updated[index], [field]: value };
      setAttributes({ rules: updated });
    };

    const updateRuleCSV = (index, csv) => {
      const values = csv
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      updateRule(index, 'values', values);
      updateRule(index, 'valueCSV', csv);
    };

    const addRule = () => {
      setAttributes({
        rules: [...rules, { key: '', value: '', values: [], valueCSV: '', operator: 'equals', caseSensitive: false }]
      });
    };

    const removeRule = (index) => {
      const updated = [...rules];
      updated.splice(index, 1);
      setAttributes({ rules: updated });
    };

    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title="Query Rules">
            {rules.map((r, i) => (
              <div key={i} style={{ border: '1px solid #ddd', padding: '8px', marginBottom: '8px' }}>
                <TextControl
                  label="Query key"
                  value={r.key || ''}
                  onChange={(val) => updateRule(i, 'key', val)}
                />

                <SelectControl
                  label="Operator"
                  value={r.operator || 'equals'}
                  options={OPERATORS}
                  onChange={(val) => updateRule(i, 'operator', val)}
                />

                {(() => {
                  const op = r.operator || 'equals';
                  if ('exists' === op || 'notExists' === op) return null;

                  if (isMultiValueOp(op)) {
                    return (
                      <TextControl
                        label="Values (comma-separated)"
                        help="Example: HRR, ESP-3, ESP-4"
                        value={r.valueCSV ?? (r.values?.join(', ') || '')}
                        onChange={(csv) => updateRuleCSV(i, csv)}
                      />
                    );
                  }

                  return (
                    <TextControl
                      label="Required value"
                      value={r.value || ''}
                      onChange={(val) => updateRule(i, 'value', val)}
                    />
                  );
                })()}

                <ToggleControl
                  label="Case Sensitive"
                  checked={!!r.caseSensitive}
                  onChange={(val) => updateRule(i, 'caseSensitive', val)}
                />

                <div style={{ textAlign: 'right' }}>
                  <Button isLink isDestructive onClick={() => removeRule(i)}>Remove</Button>
                </div>
              </div>
            ))}
            <Button variant="primary" onClick={addRule}>Add rule</Button>
          </PanelBody>

          <PanelBody title="Settings" initialOpen={false}>
            <SelectControl
              label="Logic Between Rules"
              value={logic}
              options={[
                { label: 'AND (all rules must match)', value: 'AND' },
                { label: 'OR (any rule matches)', value: 'OR' }
              ]}
              onChange={(val) => setAttributes({ logic: val })}
            />
            <ToggleControl
              label="Invert (Show when NOT matching)"
              checked={!!invert}
              onChange={(val) => setAttributes({ invert: val })}
            />
            <ToggleControl
              label="Case Sensitive (Global Default)"
              checked={!!caseSensitive}
              onChange={(val) => setAttributes({ caseSensitive: val })}
            />
            <ToggleControl
              label="Enable Client-Side Check"
              checked={!!clientSideCheck}
              onChange={(val) => setAttributes({ clientSideCheck: val })}
            />
            <ToggleControl
              label="Hide Until JS Runs (Editor Hint)"
              checked={!!hideUntilJs}
              onChange={(val) => setAttributes({ hideUntilJs: val })}
            />
          </PanelBody>
        </InspectorControls>

        <div {...blockProps}>
          <div style={{ fontSize: '12px', color: '#aaa', marginBlock: '8px' }}>
            Conditional content: will only render if query rules match.
          </div>
          <InnerBlocks templateLock={false} />
        </div>
      </Fragment>
    );
  },
  save: () => <InnerBlocks.Content />
});
