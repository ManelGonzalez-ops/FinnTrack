import { Chip, ClickAwayListener, FormControl, Input, InputLabel, makeStyles, MenuItem, Select, useTheme } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import DoneIcon from '@material-ui/icons/Done';


const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


export const Multioption = ({ fields, setChosenFields, chosenFields }) => {
    const [selections, setSelections] = useState(chosenFields)
    const classes = useStyles()
    const multiselector = useRef(null)
    const theme = useTheme()
    const [isOpen, setIsOpen] = useState(false)

    useEffect(()=>{
        const closeMultiselector =(e)=>{
            if(!multiselector.current.contains(e.target)){
                setIsOpen(false)
            }
        }
        window.addEventListener("click", closeMultiselector)
        return ()=>{
            window.removeEventListener("click", closeMultiselector)
        }
    })

    useEffect(() => {
        setChosenFields(selections)
    }, [selections])

    const handleChipDelete =(val)=>{
        setSelections(prev=>prev.filter(item=>item!==val))
    }

    return (
        
        <FormControl className={classes.formControl}
        ref={multiselector}
        >
            <InputLabel id="demo-mutiple-chip-label">Chip</InputLabel>
            
            <Select
                labelId="demo-mutiple-chip-label"
                id="demo-mutiple-chip"
                open={isOpen}
                onClick={(e)=>{ !isOpen && setIsOpen(true)}}
                multiple
                value={selections}
                onChange={(e) => { setSelections(e.target.value) }}
                input={<Input id="select-multiple-chip" />}
                renderValue={(selected) => (
                    <div className={classes.chips}>
                        {selected.map((value) => (
                            <Chip
                                key={value}
                                label={value}
                                className={classes.chip}
                                clickable
                                onDelete={()=>{handleChipDelete(value)}}
                            />
                        ))}
                    </div>
                )}
                MenuProps={MenuProps}
            >
                {Object.keys(fields).map((name) => (
                    <MenuItem key={name} value={name} style={getStyles(name, fields, theme)}>
                        {name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
            
   
    )
}

function getStyles(name, fields, theme) {
    return {
        fontWeight:
            Object.keys(fields).indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}