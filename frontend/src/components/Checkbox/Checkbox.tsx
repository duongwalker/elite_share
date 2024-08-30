import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';


type Label = string

export default function CheckboxLabel(props: Label[]) {
    return (
        <FormGroup>
            {
                props && props.map((prop) => {
                    return <FormControlLabel control={<Checkbox defaultChecked />} label={prop} />
                })
            }
        </FormGroup>
    );
}
