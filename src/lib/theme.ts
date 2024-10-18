import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const MFHTheme: CustomThemeConfig = {
	name: 'mfh-theme',
	properties: {
		// =~= Theme Properties =~=
		'--theme-font-family-base': `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		'--theme-font-family-heading': `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		'--theme-font-color-base': '0 0 0',
		'--theme-font-color-dark': '255 255 255',
		'--theme-rounded-base': '4px',
		'--theme-rounded-container': '12px',
		'--theme-border-base': '2px',
		// =~= Theme On-X Colors =~=
		'--on-primary': '255 255 255',
		'--on-secondary': '0 0 0',
		'--on-tertiary': '0 0 0',
		'--on-success': '0 0 0',
		'--on-warning': '0 0 0',
		'--on-error': '255 255 255',
		'--on-surface': '0 0 0',
		// =~= Theme Colors  =~=
		// primary | #5D536B
		'--color-primary-50': '231 229 233', // #e7e5e9
		'--color-primary-100': '223 221 225', // #dfdde1
		'--color-primary-200': '215 212 218', // #d7d4da
		'--color-primary-300': '190 186 196', // #bebac4
		'--color-primary-400': '142 135 151', // #8e8797
		'--color-primary-500': '93 83 107', // #5D536B
		'--color-primary-600': '84 75 96', // #544b60
		'--color-primary-700': '70 62 80', // #463e50
		'--color-primary-800': '56 50 64', // #383240
		'--color-primary-900': '46 41 52', // #2e2934
		// secondary | #FFD1BA
		'--color-secondary-50': '255 248 245', // #fff8f5
		'--color-secondary-100': '255 246 241', // #fff6f1
		'--color-secondary-200': '255 244 238', // #fff4ee
		'--color-secondary-300': '255 237 227', // #ffede3
		'--color-secondary-400': '255 223 207', // #ffdfcf
		'--color-secondary-500': '255 209 186', // #FFD1BA
		'--color-secondary-600': '230 188 167', // #e6bca7
		'--color-secondary-700': '191 157 140', // #bf9d8c
		'--color-secondary-800': '153 125 112', // #997d70
		'--color-secondary-900': '125 102 91', // #7d665b
		// tertiary | #64B6AC
		'--color-tertiary-50': '232 244 243', // #e8f4f3
		'--color-tertiary-100': '224 240 238', // #e0f0ee
		'--color-tertiary-200': '216 237 234', // #d8edea
		'--color-tertiary-300': '193 226 222', // #c1e2de
		'--color-tertiary-400': '147 204 197', // #93ccc5
		'--color-tertiary-500': '100 182 172', // #64B6AC
		'--color-tertiary-600': '90 164 155', // #5aa49b
		'--color-tertiary-700': '75 137 129', // #4b8981
		'--color-tertiary-800': '60 109 103', // #3c6d67
		'--color-tertiary-900': '49 89 84', // #315954
		// success | #0CCE6B
		'--color-success-50': '219 248 233', // #dbf8e9
		'--color-success-100': '206 245 225', // #cef5e1
		'--color-success-200': '194 243 218', // #c2f3da
		'--color-success-300': '158 235 196', // #9eebc4
		'--color-success-400': '85 221 151', // #55dd97
		'--color-success-500': '12 206 107', // #0CCE6B
		'--color-success-600': '11 185 96', // #0bb960
		'--color-success-700': '9 155 80', // #099b50
		'--color-success-800': '7 124 64', // #077c40
		'--color-success-900': '6 101 52', // #066534
		// warning | #F3A712
		'--color-warning-50': '253 242 219', // #fdf2db
		'--color-warning-100': '253 237 208', // #fdedd0
		'--color-warning-200': '252 233 196', // #fce9c4
		'--color-warning-300': '250 220 160', // #fadca0
		'--color-warning-400': '247 193 89', // #f7c159
		'--color-warning-500': '243 167 18', // #F3A712
		'--color-warning-600': '219 150 16', // #db9610
		'--color-warning-700': '182 125 14', // #b67d0e
		'--color-warning-800': '146 100 11', // #92640b
		'--color-warning-900': '119 82 9', // #775209
		// error | #D7263D
		'--color-error-50': '249 222 226', // #f9dee2
		'--color-error-100': '247 212 216', // #f7d4d8
		'--color-error-200': '245 201 207', // #f5c9cf
		'--color-error-300': '239 168 177', // #efa8b1
		'--color-error-400': '227 103 119', // #e36777
		'--color-error-500': '215 38 61', // #D7263D
		'--color-error-600': '194 34 55', // #c22237
		'--color-error-700': '161 29 46', // #a11d2e
		'--color-error-800': '129 23 37', // #811725
		'--color-error-900': '105 19 30', // #69131e
		// surface | #e5e5e5
		'--color-surface-50': '249 249 249', // #f9f9f9
		'--color-surface-100': '246 246 246', // #f6f6f6
		'--color-surface-200': '244 244 244', // #f4f4f4
		'--color-surface-300': '238 238 238', // #eeeeee
		'--color-surface-400': '225 225 225', // #e1e1e1
		'--color-surface-500': '212 212 212', // #d4d4d4
		'--color-surface-600': '191 191 191', // #bfbfbf
		'--color-surface-700': '159 159 159', // #9f9f9f
		'--color-surface-800': '127 127 127', // #7f7f7f
		'--color-surface-900': '104 104 104' // #686868
	}
};
