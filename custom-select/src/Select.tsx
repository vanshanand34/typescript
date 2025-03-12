import { KeyboardEvent, useEffect, useRef, useState } from "react";
import styles from "./Select.module.css";

//types

export type SelectOption = {
    label: string,
    value: any
}

type MultiSelectProps = {
    multiple: true,
    value: SelectOption[],
    onChange: (v: SelectOption[]) => void
};

type SingleSelectProps = {
    multiple?: false,
    value?: SelectOption,
    onChange: (v: SelectOption | undefined) => void
};

type SelectProps = {
    options: SelectOption[]
} & (SingleSelectProps | MultiSelectProps);


// Select Element

export function Select({ multiple, value, options, onChange }: SelectProps) {

    const [isOpen, setIsOpen] = useState(false);
    const [highlightedOption, setHighlightedOption] = useState(0);
    const ContainerRef = useRef<HTMLDivElement>(null);

    function isOptionSelected(option: SelectOption) {
        if (!multiple) return option.value === value?.value;
        for (let i = 0; i < value.length; i++) {
            if (value[i].value === option.value) return true;
        }
        return false;
    }

    function isHighlightedOption(index: number) {
        return highlightedOption === index;
    }

    function clearOptions(e: React.MouseEvent) {
        e.stopPropagation();
        if (!multiple) onChange(undefined);
        else onChange([]);
    }

    function selectOption(option: SelectOption) {
        if (multiple) {
            if (isOptionSelected(option))
                removeOption(option);
            else
                onChange([...value, option]);
        } else {
            if (value?.value !== option.value)
                onChange(option);
        }
    }

    function removeOption(option: SelectOption) {
        if (!multiple) return;
        const newOptions = value.filter(o => o.value != option.value);
        onChange(newOptions);
    }

    useEffect(() => {
        if (isOpen) setHighlightedOption(0);
    }, [isOpen])

    const handler = (e: KeyboardEvent) => {
        e.preventDefault();

        if (e.target != ContainerRef.current) return;

        if ((e.code == "Enter" || e.code == "Space") && !e.repeat)
            setIsOpen(prev => !prev);

        if (e.code == "ArrowUp")
            setHighlightedOption(prev => (prev == 0 ? options.length - 1 : prev - 1));

        if (e.code == "ArrowDown")
            setHighlightedOption(prev => ((prev + 1) % options.length));
    }

    return (
        <div
            ref={ContainerRef}
            onBlur={() => setIsOpen(false)}
            onClick={() => setIsOpen(prevVal => !prevVal)}
            onKeyDown={handler}
            tabIndex={0}
            className={`${styles.container}`}
        >
            <span className={`${styles.value}`}>{
                multiple ?
                    value.map(option =>
                        <button
                            className={`${styles["options-btn"]}`}
                            key={option.value}
                        >{option.value}
                            <span
                                className={`${styles["option-close"]}`}
                                onClick={() => selectOption(option)}
                            >&times;</span>
                        </button>

                    ) : value?.label}</span>
            <button
                className={`${styles["close-btn"]}`}
                onClick={clearOptions}>&times;
            </button>

            <div className={`${styles.divider}`}></div>
            <span className={`${styles.caret}`}></span>

            <ul className={`${styles.options} ${isOpen && styles.show}`}>
                {
                    options.map(
                        (option, index) => (
                            <li key={option.label}
                                value={option.value}
                                className={
                                    `${styles.option} 
                                    ${isOptionSelected(option) ? styles.selected : ""} 
                                    ${isHighlightedOption(index) ? styles.highlighted : ""}`
                                }
                                onMouseEnter={() => setHighlightedOption(index)}
                                onClick={
                                    (e) => {
                                        e.stopPropagation();
                                        setIsOpen(false);
                                        selectOption(option);
                                    }
                                }
                            >
                                {option.label}
                            </li>
                        )
                    )
                }
            </ul>
        </div>
    )
}