/**
 * Elijah Cobb
 * elijah@elijahcobb.com
 * elijahcobb.com
 * github.com/elijahjcobb
 */

import React, {PropsWithChildren, ReactElement, useContext, useRef, useState,} from "react";
import {PUICard} from "../PUICard/PUICard";
import "./PUIMutableNumericStatus.css";
import {PUIApp, PUIContext} from "../../helpers/PUIApp";
import {PUIToastType} from "../PUIToast/PUIToast";

export interface PUIMutableNumericStatusProps {
	label: string;
	value: number,
	setValue?: (value: number) => void
	range?: [number, number],
	precision?: number;
}

export function PUIMutableNumericStatus(props: PropsWithChildren<PUIMutableNumericStatusProps>): ReactElement {

	const context = useContext(PUIContext);
	const [fieldValue, setFieldValue] = useState(props.value + "");
	const input = useRef<HTMLInputElement | null>(null);

	function handleLeaveFocus(): void {
		let v = props.precision !== undefined ? parseFloat(fieldValue) : parseInt(fieldValue);
		let err: string | undefined = undefined;
		if (isNaN(v)) {
			v = 0;
			err = "That value is not a number. Will set to '0'.";
		}
		if (props.range) {
			if (v > props.range[1]) {
				err = `That value is too big, the range is "[${props.range[0]}, ${props.range[1]}]".`;
				v = props.range[1];
			}
			if (v < props.range[0]) {
				err = `That value is too small, the range is "[${props.range[0]}, ${props.range[1]}]".`;
				v = props.range[0];
			}
		}
		if (err) PUIApp.toast({msg: err, type: PUIToastType.warning})
		if (props.setValue) props.setValue(v)
		setFieldValue(v.toFixed(props.precision ?? 0))
	}

	function handleOnKeyPress(e: React.KeyboardEvent): void {
		if (e.code !== "Enter") return;
		input.current?.blur();
	}

	return (<PUICard onClick={() => input.current?.focus()} className={"PUIMutableNumericStatus"}>
		<span className={"label"}>{props.label}:</span>
		<input
			onBlur={handleLeaveFocus}
			onChange={(e) => setFieldValue(e.target.value)}
			ref={input}
			value={fieldValue}
			onKeyPress={handleOnKeyPress}
			className={"field"}/>
	</PUICard>);

}
