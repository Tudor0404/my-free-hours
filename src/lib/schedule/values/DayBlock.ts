import type { Operator } from "$types/Schedule.Operator";
import dayjs, { type Dayjs } from "dayjs";
import ValueBlock from "./ValueBlock";

export default class DayBlock extends ValueBlock<Dayjs> {
	constructor(operator: "IN", values: Dayjs[]);
	constructor(operator: "BETWEEN", values: [Dayjs, Dayjs]);
	constructor(operator: Operator, values: Dayjs[]) {
		super(
			"DAY",
			operator,
			values.map((d) => d.startOf("day")),
		);
	}

	verify_date(value: Dayjs): boolean {
		const v = value.startOf("day");
		switch (this.operator) {
			case "IN":
				if (this.values.findIndex((d) => d.isSame(v, "day")) != -1) {
					return true;
				}
				return false;
			case "BETWEEN":
				if (v.isBetween(this.values[0], this.values[1], "day", "[]")) {
					return true;
				}
				return false;
		}
	}

	verify(): boolean {
		switch (this.operator) {
			case "IN":
				for (let i = 0; i < this.values.length; i++) {
					for (let j = i + 1; j < this.values.length; j++) {
						if (this.values[i].isSame(this.values[j], "day")) {
							throw new Error(
								"When using the 'IN' operator, values must be unique",
							);
						}
					}
				}

				break;
			case "BETWEEN":
				if (this.values.length != 2) {
					throw new Error(
						"When using the 'BETWEEN' operator, there must be 2 values",
					);
				}

				if (this.values[0].isAfter(this.values[1])) {
					throw new Error(
						"The first value must be smaller or equal to the second when using the 'BETWEEN' operator",
					);
				}

				break;
		}

		return true;
	}

	public static decode_json(obj: Record<string, any>): DayBlock {
		if (
			!(obj.hasOwnProperty("operator") &&
				(obj["operator"] == "BETWEEN" || obj["operator"] == "IN"))
		) {
			throw new Error(
				"A day block should have an operator with a value of BETWEEN or IN",
			);
		}

		let d = new DayBlock(obj["operator"], []);

		if (obj.hasOwnProperty("values") && obj["values"] instanceof Array) {
			if (d.operator == "BETWEEN") {
				if (obj["values"].length === 2) {
					d.values = [dayjs(obj["values"][0]), dayjs(obj["values"][1])];
				} else {
					throw new Error(
						"The length of a values array should be 2, if the operator is BETWEEN",
					);
				}
			} else {
				for (let i = 0; i < obj["values"].length; i++) {
					d.values.push(dayjs(obj["values"][i]));
				}
			}
		} else {
			throw new Error("No values field found on day block");
		}

		return d;
	}
}
