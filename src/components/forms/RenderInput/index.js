import React from 'react';
import { Input, InputGroup, FormFeedback } from 'reactstrap';

const RenderInput = (props) => {
  const {
    input,
    meta,
    icon,
    pure,
    ...restProps
  } = props;

  const {
    error,
    invalid,
    active,
    visited
  } = meta;

  const isValid = () => {
    if (!active && invalid && visited) return false;
    if (!invalid) return true;

    return null;
  };

  if (pure) {
    return (<Input valid={isValid()} meta={meta} {...input} {...restProps}/>);
  }

  return (
    <InputGroup className="mb-3">
      <div className="input-group-prepend">
        <span className="input-group-text">
          {icon}
        </span>
      </div>
      <Input valid={isValid()} meta={meta} {...input} {...restProps}/>
      <FormFeedback>{error}</FormFeedback>
    </InputGroup>
  );
};

export default RenderInput;
