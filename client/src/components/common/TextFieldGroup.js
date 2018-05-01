import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const TextFormGroup = ({
    name,
    placeholder,
    value,
    label,
    error,
    info,
    type,
    onChange,
    disabled
}) => {
    return (
        <div className="form-group">
            <input type={type}
                className={classnames("form-control form-control-lg", {
                    'is-invalid': error
                })} 
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange} />
            {info && <small className="form-text text-muted">{info}</small>}
            {error && (<div className="invalid-feedback">{error}</div>)}
        </div>
    )
}

TextFormGroup.propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    info: PropTypes.string.isRequired,
    error: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.func.isRequired
  }

TextFormGroup.defaultProps = {
    type: 'text'
}

export default TextFormGroup;
