import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls, RichText, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import { PanelBody, TextControl, Button, ToggleControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

registerBlockType('bcgovcleanbc/multi-query-content', {
  edit: ({ attributes, setAttributes }) => {
    const {
      placeholderText, fallbackText, paramKeys, combinations,
      previewMode, previewValues, useOrLogic, alignment = 'left',
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
    const match = combinations[matchIndex];
    const simulatedOutput = placeholderText.replace(/{{\s*value\s*}}/g, match?.value || fallbackText);

    return (
      <div {...blockProps}>
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
            {combinations.map((combo, i) => (
              <div key={i} style={{
                marginBottom: '1rem',
                padding: '0.5rem',
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
                <Button isLink isDestructive onClick={() => removeCombo(i)}>Remove Combination</Button>
              </div>
            ))}
            <Button isPrimary onClick={addCombo}>Add Combination</Button>
          </PanelBody>

          <PanelBody title="Editor Preview" initialOpen={false}>
            <ToggleControl
              label="Enable Preview Mode"
              checked={previewMode}
              onChange={(val) => setAttributes({ previewMode: val })}
            />
            <ToggleControl
              label="Use OR Logic (match any)"
              checked={useOrLogic}
              onChange={(val) => setAttributes({ useOrLogic: val })}
            />
            {previewMode && paramKeys.map((key) => (
              <TextControl
                key={key}
                label={`Preview value for "${key}"`}
                value={previewValues[key] || ''}
                onChange={(val) => updatePreviewValue(key, val)}
              />
            ))}
            {previewMode && (
              <TextControl
                label="Fallback Text"
                value={fallbackText}
                onChange={(val) => setAttributes({ fallbackText: val })}
              />
            )}
          </PanelBody>
        </InspectorControls>

        <div {...useBlockProps({ style: { textAlign: alignment } })}>
          <RichText
            tagName="div"
            value={previewMode ? simulatedOutput : placeholderText}
            onChange={(val) => setAttributes({ placeholderText: val })}
            placeholder="Type display content like: Your rebate is: {{value}}"
          />
        </div>
      </Fragment>
      </div>
    );
  },
  save: () => null,
});