import React from 'react';
import Select from 'react-select';
import {SearchSystems} from '../actions/routes';

class SystemSelect extends React.Component {
    render() {
        return <Select.Async loadOptions={this.getOptions} onChange={this.props.onChange} clearable={true} value={this.props.value} />;
    }

    getOptions(input) {
        return SearchSystems(input).then(function(data) {
            return {
                options: data.map(v => ({
                    value: v.id,
                    label: v.name,
                }))
            };
        })
    }
}

export default SystemSelect;
