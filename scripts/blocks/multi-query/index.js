import { registerBlockType } from '@wordpress/blocks';
import {
  useBlockProps,
  InspectorControls,
  RichText,
  BlockControls,
  AlignmentToolbar
} from '@wordpress/block-editor';
import {
  PanelBody,
  TextControl,
  Button,
  ToggleControl
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';

registerBlockType('bcgovcleanbc/multi-query-content', {
  edit: ({ attributes, setAttributes }) => {
    const {
      placeholderText,
      fallbackText,
      paramKeys,
      combinations,
      previewMode,
      previewValues,
      useOrLogic,
      useParamValueDirect,
      alignment = 'left'
    } = attributes;

    const blockProps = useBlockProps({ style: { textAlign: alignment } });

    const updateKey = (index, value) => {
      const updatedKeys = [...paramKeys];
      updatedKeys[index] = value;

      // Reset preview values and combinations to avoid stale state.
      const newPreview = {};
      const newCombinations = combinations.map(combo => ({ ...combo }));

      // Rebuild combinations with new keys if possible.
      for (let i = 0; i < newCombinations.length; i++) {
        newCombinations[i] = Object.fromEntries(
          updatedKeys.map(k => [k, newCombinations[i][k] ?? ''])
        );
        newCombinations[i].value = combinations[i]?.value || '';
      }

      setAttributes({
        paramKeys: updatedKeys,
        combinations: newCombinations,
        previewValues: newPreview,
      });
    };

    const updatePreviewValue = (key, value) => {
      setAttributes({ previewValues: { ...previewValues, [key]: value } });
    };

    const addKey = () => setAttributes({ paramKeys: [...paramKeys, ''] });

    const removeKey = (index) => {
      const updatedKeys = [...paramKeys];
      const removedKey = updatedKeys.splice(index, 1)[0];

      // Remove the key from all combinations.
      const updatedCombinations = combinations.map(combo => {
        const newCombo = { ...combo };
        delete newCombo[removedKey];
        return newCombo;
      });

      // Also clean up preview values.
      const updatedPreview = { ...previewValues };
      delete updatedPreview[removedKey];

      setAttributes({
        paramKeys: updatedKeys,
        combinations: updatedCombinations,
        previewValues: updatedPreview,
      });
    };

    const updateCombo = (index, field, value) => {
      const updated = combinations.map(combo => ({ ...combo }));
      updated[index][field] = value;
      setAttributes({ combinations: updated });
    };

    const addCombo = () => {
      const cloned = combinations.map(combo => ({ ...combo }));
      const newCombo = Object.fromEntries(paramKeys.map(k => [k, '']));
      newCombo.value = '';
      setAttributes({ combinations: [...cloned, newCombo] });
    };

    const removeCombo = (index) => {
      const updated = combinations.map(combo => ({ ...combo }));
      updated.splice(index, 1);
      setAttributes({ combinations: updated });
    };

    const matchIndex = combinations.findIndex((combo) =>
      useOrLogic
        ? paramKeys.some(key => combo[key] === previewValues[key])
        : paramKeys.every(key => combo[key] === previewValues[key])
    );

    let simulatedOutput = placeholderText;

    if (previewMode) {
      if (useParamValueDirect) {
        const placeholderMatches =
          placeholderText.match(/{{\s*value(?:_\d+)?\s*}}/g) || [];

        const requiredIndexes = [...new Set(
          placeholderMatches.map((match) => {
            const numberMatch = match.match(/\d+/);
            return numberMatch ? parseInt(numberMatch[0], 10) - 1 : 0;
          })
        )];

        const allPresent = requiredIndexes.every((i) => {
          const key = paramKeys[i];
          return key && previewValues[key] !== '';
        });

        if (allPresent) {
          simulatedOutput = placeholderText;

          requiredIndexes.forEach((i) => {
            const key = paramKeys[i];
            const value = previewValues[key] || '';

            simulatedOutput = simulatedOutput.replace(
              new RegExp(`{{\\s*value_${i + 1}\\s*}}`, 'g'),
              value
            );

            // Replace {{value}} as an alias for value_1.
            if (0 === i) {
              simulatedOutput = simulatedOutput.replace(
                /{{\s*value\s*}}/g,
                value
              );
            }
          });
        } else {
          simulatedOutput = fallbackText;
        }
      } else {
        const hasCombinations = combinations.length > 0;
        let match = null;

        if (hasCombinations) {
          const matchIndex = combinations.findIndex((combo) =>
            useOrLogic
              ? paramKeys.some((key) => combo[key] === previewValues[key])
              : paramKeys.every((key) => combo[key] === previewValues[key])
          );
          match = combinations[matchIndex];
        }

        if (match && match.value) {
          simulatedOutput = placeholderText.replace(
            /{{\s*value\s*}}/g,
            match.value
          );
        } else {
          // No combinations or no match: use fallback for entire content.
          simulatedOutput = fallbackText;
        }
      }
    }

    return (
      <Fragment>
        <BlockControls>
          <AlignmentToolbar
            value={alignment}
            onChange={(newAlign) => setAttributes({ alignment: newAlign })}
          />
        </BlockControls>

        <InspectorControls>
          <PanelBody title="Query Parameters">
            {paramKeys.map((key, i) => (
              <div key={i} style={{ marginBottom: '0' }}>
                <TextControl
                  label={`Param Key #${i + 1}`}
                  value={key}
                  onChange={(val) => updateKey(i, val)}
                />
                <div style={{ textAlign: 'right' }}>
                  <Button isLink isDestructive onClick={() => removeKey(i)}>Remove</Button>
                </div>
              </div>
            ))}
            <Button isPrimary onClick={addKey}>Add Parameter</Button>
          </PanelBody>

          <PanelBody title="Value Combinations" initialOpen={false}>
            <ToggleControl
              label="Use parameter query string value(s) as output"
              checked={useParamValueDirect}
              onChange={(val) => {
                setAttributes({
                  useParamValueDirect: val,
                  combinations: val ? [] : combinations
                });
              }}
            />
            {useParamValueDirect && (
              <div style={{ padding: '0 0.5rem 1rem', fontSize: '13px', color: '#555' }}>
                <strong>Instructions:</strong><br />
                You can reference each parameter’s value in your placeholder using their value replacement pattern:
                <ul>
                  {paramKeys.map((key, i) => (
                    <li key={i} style={{ padding: '0 0 0.5rem' }}>
                      For <code>{key}</code> placeholder use:<br /> {0 === i
                        ? `{{value}} or {{value_1}}`
                        : `{{value_${i + 1}}}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}


            {combinations.map((combo, i) => (
              <div key={i} style={{
                marginBottom: '1rem',
                padding: '0.5rem',
                opacity: useParamValueDirect ? 0.5 : 1,
                pointerEvents: useParamValueDirect ? 'none' : 'auto',
                border: i === matchIndex ? '2px solid green' : '1px solid #ccc',
                background: i === matchIndex ? '#eaffea' : 'transparent'
              }}>
                {paramKeys.map((key) => (
                  <TextControl
                    key={key}
                    label={`Value for "${key}"`}
                    value={combo[key] || ''}
                    onChange={(val) => updateCombo(i, key, val)}
                  />
                ))}
                <TextControl
                  label="Output Value"
                  value={combo.value}
                  onChange={(val) => updateCombo(i, 'value', val)}
                />
                <div style={{ textAlign: 'right' }}>
                  <Button isLink isDestructive onClick={() => removeCombo(i)}>
                    Remove Combination
                  </Button>
                </div>
              </div>
            ))}
            <Button
              isPrimary
              onClick={addCombo}
              disabled={useParamValueDirect}
            >
              Add Combination
            </Button>
          </PanelBody>

          <PanelBody title="Editor Preview" initialOpen={false}>
            <ToggleControl
              label="Enable Preview Mode"
              checked={previewMode}
              onChange={(val) => setAttributes({ previewMode: val })}
              help="Any placeholders like {{value}}, {{value_1}}, etc. inside your content will be replaced with the corresponding preview values you provide."
            />
            <ToggleControl
              label="Use OR Logic (match any)"
              checked={useOrLogic}
              onChange={(val) => setAttributes({ useOrLogic: val })}
            />
            {previewMode && paramKeys.map((key, i) => (
              <TextControl
                key={key}
                label={`Preview value for "${key}"`}
                help={
                  useParamValueDirect
                    ? 0 === i
                      ? `Use {{value}} or {{value_1}} as the placeholder for this parameter.`
                      : `Use {{value_${i + 1}}} as the placeholder for this parameter.`
                    : ''
                }
                value={previewValues[key] || ''}
                onChange={(val) => updatePreviewValue(key, val)}
              />
            ))} 

            <TextControl
              label="Fallback Text (when nothing matches)"
              value={fallbackText}
              onChange={(val) => setAttributes({ fallbackText: val })}
              help="When preview values do not find a valid match, the Fallback Text will be displayed instead of the placeholder content. If the Fallback Text is empty, 'No fallback text provided' will be output. Enable preview mode to test."
            />
          </PanelBody>
        </InspectorControls>

        <div {...blockProps}>
          <RichText
            tagName="div"
            value={previewMode ? simulatedOutput : placeholderText}
            onChange={(val) => setAttributes({ placeholderText: val })}
            placeholder={
              previewMode && '' === fallbackText
                ? `No fallback text provided. Content with replacement pattern: ${placeholderText}`
                : undefined
            }
          />
        </div>
      </Fragment>
    );
  },
  save: () => null,
});