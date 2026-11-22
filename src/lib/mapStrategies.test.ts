import { describe, expect, it } from 'vitest';
import {
	CHILDCARE_NO_DATA_COLOR,
	FREE_SCHOOL_MEALS_NO_DATA_COLOR,
	RELIGIOUS_EDUCATION_NO_DATA_COLOR,
	TEACHER_QUALIFICATIONS_NO_DATA_COLOR,
	formatSchoolUniformPopup,
	formatFreeSchoolMealsPopup,
	formatReligiousEducationPopup,
	formatTeacherQualificationsPopup,
	formatSummerHolidayPopup,
	formatSummerHolidayDuration,
	formatSchoolStartingAge,
	formatSchoolStartingAgePopup,
	getChildcareCostColor,
	getFreeSchoolMealsColor,
	getReligiousEducationColor,
	getTeacherQualificationsColor,
	getSummerHolidayColor,
	getSchoolStartingAgeColor,
	getSchoolUniformColor,
	getSchoolUniformCategoryLabel,
	mapStrategies,
	freeSchoolMealsStrategy,
	religiousEducationStrategy,
	teacherQualificationsStrategy,
	schoolStartingAgeStrategy,
	summerHolidaysStrategy,
	schoolUniformsStrategy,
	SCHOOL_UNIFORMS_NO_DATA_COLOR,
	SUMMER_HOLIDAYS_NO_DATA_COLOR,
	SCHOOL_STARTING_AGE_NO_DATA_COLOR,
} from '@/lib/mapStrategies';
import { isSafeHttpsUrl } from '@/lib/adapters/schoolUniformsAdapter';
import type { MapTooltipContext } from '@/lib/mapStrategies';

function schoolUniformContext(
	overrides: Partial<MapTooltipContext> = {},
): MapTooltipContext {
	return {
		country: 'United Kingdom',
		value: 'standard',
		estimated: false,
		indicator: 'School uniform policy',
		unit: 'policy category',
		...overrides,
	};
}

describe('childcare map strategy', () => {
	it.each([
		[null, CHILDCARE_NO_DATA_COLOR],
		[Number.NaN, CHILDCARE_NO_DATA_COLOR],
		[0, '#ffeda0'],
		[4.99, '#ffeda0'],
		[5, '#feb24c'],
		[9.99, '#feb24c'],
		[10, '#f03b20'],
		[14.99, '#f03b20'],
		[15, '#bd0026'],
	])('uses the expected color for value %s', (value, color) => {
		expect(getChildcareCostColor(value)).toBe(color);
		expect(mapStrategies.childcare.colorScale(value)).toBe(color);
	});

	it('keeps legend swatches aligned with the color thresholds', () => {
		const colors = mapStrategies.childcare.legendIntervals.map(({ color }) => color);

		expect(colors).toEqual([
			CHILDCARE_NO_DATA_COLOR,
			getChildcareCostColor(0),
			getChildcareCostColor(5),
			getChildcareCostColor(10),
			getChildcareCostColor(15),
		]);
	});

	it('formats a childcare tooltip with the value, unit, and year', () => {
		expect(
			mapStrategies.childcare.formatTooltip({
				country: 'France',
				value: 9.25,
				year: 2023,
				estimated: false,
				indicator: 'Net childcare cost',
				unit: '% of disposable household income',
			}),
		).toBe('9.3% of disposable household income (2023)');
	});

	it('formats missing childcare data without undefined values', () => {
		expect(
			mapStrategies.childcare.formatTooltip({
				country: 'Türkiye',
				value: null,
				year: 2023,
				estimated: false,
				indicator: 'Net childcare cost',
				unit: '% of disposable household income',
			}),
		).toBe('No OECD data available');
	});
});

describe('renewable map strategy', () => {
	it('formats a renewable tooltip and marks estimated values', () => {
		expect(
			mapStrategies.renewable.formatTooltip({
				country: 'Spain',
				value: 24.56,
				year: 2024,
				estimated: true,
				indicator: 'Renewable energy share',
				unit: '%',
			}),
		).toBe('Renewable energy share (2024): 24.6% (estimate)');
	});

	it('formats missing renewable data', () => {
		expect(
			mapStrategies.renewable.formatTooltip({
				country: 'United Kingdom',
				value: null,
				year: 2024,
				estimated: false,
				indicator: 'Renewable energy share',
				unit: '%',
			}),
		).toBe('Renewable energy share: no data');
	});
});

describe('school uniforms map strategy', () => {
	it.each([
		['standard', '#0f766e'],
		['optional_or_private', '#d4a373'],
		['not_used', '#cbd5e1'],
		[null, SCHOOL_UNIFORMS_NO_DATA_COLOR],
		['unknown', SCHOOL_UNIFORMS_NO_DATA_COLOR],
		['toString', SCHOOL_UNIFORMS_NO_DATA_COLOR],
	])('maps category %s to its qualitative color', (category, color) => {
		expect(getSchoolUniformColor(category)).toBe(color);
		expect(schoolUniformsStrategy.colorScale(category)).toBe(color);
	});

	describe('teacher qualifications map strategy', () => {
		it.each([
			['masters_all', '#0f766e'],
			['masters_secondary_only', '#3b82f6'],
			['bachelors_all', '#d4a373'],
			[null, TEACHER_QUALIFICATIONS_NO_DATA_COLOR],
			['unknown', TEACHER_QUALIFICATIONS_NO_DATA_COLOR],
			['toString', TEACHER_QUALIFICATIONS_NO_DATA_COLOR],
		])('maps category %s to its qualitative color', (category, color) => {
			expect(getTeacherQualificationsColor(category)).toBe(color);
			expect(teacherQualificationsStrategy.colorScale(category)).toBe(color);
		});

		describe('religious education map strategy', () => {
			it.each([
				['secular', '#cbd5e1'],
				['non_confessional', '#0f766e'],
				['confessional_opt_out', '#3b82f6'],
				['statutory_worship_or_patron', '#d4a373'],
				[null, RELIGIOUS_EDUCATION_NO_DATA_COLOR],
				['unknown', RELIGIOUS_EDUCATION_NO_DATA_COLOR],
				['toString', RELIGIOUS_EDUCATION_NO_DATA_COLOR],
			])('maps category %s to its qualitative color', (category, color) => {
				expect(getReligiousEducationColor(category)).toBe(color);
				expect(religiousEducationStrategy.colorScale(category)).toBe(color);
			});

			it('uses category labels in hover tooltips and selected-country details', () => {
				const context = schoolUniformContext({
					country: 'United Kingdom',
					value: 'statutory_worship_or_patron',
					note: 'State schools provide religious education and collective worship with parental opt-out.',
					sourceLabel: 'Eurydice – National Education Systems',
					sourceUrl: 'https://eurydice.eacea.ec.europa.eu/national-education-systems',
				});

				expect(religiousEducationStrategy.formatTooltip(context)).toBe(
					'Statutory Worship / Faith-Patron System',
				);
				expect(formatReligiousEducationPopup(context)).toEqual({
					valueLabel: 'Statutory Worship / Faith-Patron System',
					note: 'State schools provide religious education and collective worship with parental opt-out.',
					sourceLabel: 'Eurydice – National Education Systems',
					sourceUrl: 'https://eurydice.eacea.ec.europa.eu/national-education-systems',
				});
			});

			it('omits unsafe external sources from selected-country details', () => {
				expect(
					formatReligiousEducationPopup(
						schoolUniformContext({
							value: 'secular',
							note: 'Religious instruction is excluded from the curriculum.',
							sourceLabel: 'Unsafe source',
							sourceUrl: 'javascript:alert(1)',
						}),
					),
				).toEqual({
					valueLabel: 'Secular (Excluded from Curriculum)',
					note: 'Religious instruction is excluded from the curriculum.',
				});
			});
		});

		it('uses category labels in hover tooltips and selected-country details', () => {
			const context = schoolUniformContext({
				country: 'Finland',
				value: 'masters_all',
				note: "A Master's degree (ISCED 7) is required for both primary and secondary teachers.",
				sourceLabel: 'Eurydice – Teachers in Europe',
				sourceUrl: 'https://eurydice.eacea.ec.europa.eu/national-education-systems',
			});

			expect(teacherQualificationsStrategy.formatTooltip(context)).toBe(
				"Master's (Primary & Secondary)",
			);
			expect(formatTeacherQualificationsPopup(context)).toEqual({
				valueLabel: "Master's (Primary & Secondary)",
				note: "A Master's degree (ISCED 7) is required for both primary and secondary teachers.",
				sourceLabel: 'Eurydice – Teachers in Europe',
				sourceUrl: 'https://eurydice.eacea.ec.europa.eu/national-education-systems',
			});
		});

		it('omits unsafe external sources from selected-country details', () => {
			expect(
				formatTeacherQualificationsPopup(
					schoolUniformContext({
						value: 'bachelors_all',
						note: 'A bachelor-level qualification is required.',
						sourceLabel: 'Unsafe source',
						sourceUrl: 'javascript:alert(1)',
					}),
				),
			).toEqual({
				valueLabel: "Bachelor's + Teaching Qualification",
				note: 'A bachelor-level qualification is required.',
			});
		});
	});

	describe('school starting age map strategy', () => {
		it.each([
			[3, '#0f766e'],
			[4.5, '#0f766e'],
			[5, '#3b82f6'],
			[6, '#93c5fd'],
			[7, '#cbd5e1'],
			[null, SCHOOL_STARTING_AGE_NO_DATA_COLOR],
			[undefined, SCHOOL_STARTING_AGE_NO_DATA_COLOR],
		])('maps age %s into its Eurydice bucket', (age, color) => {
			expect(getSchoolStartingAgeColor(age)).toBe(color);
			expect(schoolStartingAgeStrategy.colorScale(age ?? null)).toBe(color);
		});

		it('formats tooltip and selected-country details with a safe source', () => {
			const context = schoolUniformContext({
				country: 'Estonia',
				value: 7,
				note: 'Compulsory basic education starts at age 7.',
				sourceLabel: 'Eurydice – Compulsory Education in Europe',
				sourceUrl: 'https://eurydice.eacea.ec.europa.eu/publications',
			});

			expect(formatSchoolStartingAge(7)).toBe('Age 7');
			expect(schoolStartingAgeStrategy.formatTooltip(context)).toBe('Age 7');
			expect(formatSchoolStartingAgePopup(context)).toEqual({
				valueLabel: 'Age 7',
				note: 'Compulsory basic education starts at age 7.',
				sourceLabel: 'Eurydice – Compulsory Education in Europe',
				sourceUrl: 'https://eurydice.eacea.ec.europa.eu/publications',
			});
		});

		it('omits a source link when the URL is not HTTPS', () => {
			expect(
				formatSchoolStartingAgePopup(
					schoolUniformContext({
						value: 5,
						note: 'Compulsory education starts at age 5.',
						sourceLabel: 'Unsafe source',
						sourceUrl: 'http://example.test/source',
					}),
				),
			).toEqual({
				valueLabel: 'Age 5',
				note: 'Compulsory education starts at age 5.',
			});
		});
	});

	it('uses the category label in the hover tooltip', () => {
		expect(
			mapStrategies['school-uniforms'].formatTooltip(
				schoolUniformContext({ value: 'optional_or_private' }),
			),
		).toBe('Mostly private / optional');
	});

	it('formats a selected-country detail with its note and safe source link', () => {
		expect(
			formatSchoolUniformPopup(
				schoolUniformContext({
					note: 'Uniform policy is set by individual schools.',
					sourceLabel: 'UK Department for Education',
					sourceUrl: 'https://www.gov.uk/example',
				}),
			),
		).toEqual({
			valueLabel: 'Standard in state schools',
			note: 'Uniform policy is set by individual schools.',
			sourceLabel: 'UK Department for Education',
			sourceUrl: 'https://www.gov.uk/example',
		});
	});

	describe('summer holidays map strategy', () => {
		it.each([
			[8, '#cbd5e1'],
			[8.1, '#93c5fd'],
			[10, '#93c5fd'],
			[10.1, '#3b82f6'],
			[12, '#3b82f6'],
			[12.1, '#0f766e'],
			[null, SUMMER_HOLIDAYS_NO_DATA_COLOR],
			[undefined, SUMMER_HOLIDAYS_NO_DATA_COLOR],
		])('maps %s weeks to the correct Eurydice bucket', (weeks, color) => {
			expect(getSummerHolidayColor(weeks)).toBe(color);
			expect(summerHolidaysStrategy.colorScale(weeks ?? null)).toBe(color);
		});

		it('formats duration values for hover and selected-country details', () => {
			const context = {
				...schoolUniformContext({
					country: 'Italy',
					value: 13,
					note: 'The summer break lasts about thirteen weeks.',
					sourceLabel: 'Eurydice – European School Calendars',
					sourceUrl: 'https://eurydice.eacea.ec.europa.eu/data-and-visuals/european-school-calendars',
				}),
				indicator: 'Summer school holiday duration',
				unit: 'weeks',
			};

			expect(formatSummerHolidayDuration(13)).toBe('~13 weeks');
			expect(summerHolidaysStrategy.formatTooltip(context)).toBe('~13 weeks');
			expect(formatSummerHolidayPopup(context)).toEqual({
				valueLabel: '~13 weeks',
				note: 'The summer break lasts about thirteen weeks.',
				sourceLabel: 'Eurydice – European School Calendars',
				sourceUrl: 'https://eurydice.eacea.ec.europa.eu/data-and-visuals/european-school-calendars',
			});
		});

		it('omits unsafe external sources from the selected-country details', () => {
			expect(
				formatSummerHolidayPopup(
					schoolUniformContext({
						value: 9,
						note: 'Summer holidays last about nine weeks.',
						sourceLabel: 'Unsafe source',
						sourceUrl: 'http://example.test/source',
					}),
				),
			).toEqual({
				valueLabel: '~9 weeks',
				note: 'Summer holidays last about nine weeks.',
			});
		});
	});

	describe('free school meals map strategy', () => {
		it.each([
			['universal', '#0f766e'],
			['partial_universal', '#3b82f6'],
			['targeted', '#d4a373'],
			['none', '#cbd5e1'],
			[null, FREE_SCHOOL_MEALS_NO_DATA_COLOR],
			['unknown', FREE_SCHOOL_MEALS_NO_DATA_COLOR],
			[Number.NaN, FREE_SCHOOL_MEALS_NO_DATA_COLOR],
		])('maps category %s to its qualitative color', (category, color) => {
			expect(getFreeSchoolMealsColor(category)).toBe(color);
			expect(freeSchoolMealsStrategy.colorScale(category)).toBe(color);
		});

		it('uses the category label in the hover tooltip', () => {
			expect(
				freeSchoolMealsStrategy.formatTooltip(
					schoolUniformContext({ value: 'partial_universal' }),
				),
			).toBe('Partial Universal / Transitioning');
		});

		it('formats selected-country details and includes only safe HTTPS links', () => {
			const context = schoolUniformContext({
				value: 'universal',
				note: 'Universal meals are provided to all pupils.',
				sourceLabel: 'Eurydice – Finland',
				sourceUrl: 'https://eurydice.eacea.ec.europa.eu/national-education-systems/finland/overview',
			});

			expect(formatFreeSchoolMealsPopup(context)).toEqual({
				valueLabel: 'Universal (Primary & Secondary)',
				note: 'Universal meals are provided to all pupils.',
				sourceLabel: 'Eurydice – Finland',
				sourceUrl:
					'https://eurydice.eacea.ec.europa.eu/national-education-systems/finland/overview',
			});
			for (const sourceUrl of ['http://example.test/source', 'javascript:alert(1)']) {
				expect(
					formatFreeSchoolMealsPopup({
						...context,
						sourceUrl,
					}),
				).toEqual({
					valueLabel: 'Universal (Primary & Secondary)',
					note: 'Universal meals are provided to all pupils.',
				});
			}
		});
	});

	it('omits empty notes and rejects non-HTTPS source links', () => {
		const details = formatSchoolUniformPopup(
			schoolUniformContext({
				note: '  ',
				sourceLabel: 'Unsafe reference',
				sourceUrl: 'javascript:alert(1)',
			}),
		);

		expect(details).toEqual({ valueLabel: 'Standard in state schools' });
		expect(isSafeHttpsUrl('https://example.test/source')).toBe(true);
		expect(isSafeHttpsUrl('http://example.test/source')).toBe(false);
		expect(isSafeHttpsUrl('javascript:alert(1)')).toBe(false);
	});

	it('provides a clear fallback when the country has no dataset entry', () => {
		expect(
			formatSchoolUniformPopup(schoolUniformContext({ value: null })),
		).toEqual({
			valueLabel: 'No policy data available',
			note: 'No curated school-uniform policy entry is available for this country.',
		});
		expect(getSchoolUniformCategoryLabel('unknown')).toBe('No policy data available');
	});
});
