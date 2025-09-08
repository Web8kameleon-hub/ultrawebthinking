import { cva, type VariantProps } from 'class-variance-authority'

export const containerVariants = cva(
  'padding text-center',
  {
    variants: {
      size: {
        small: 'p-4',
        medium: 'p-5',
        large: 'p-8'
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
      }
    },
    defaultVariants: {
      size: 'medium',
      align: 'center'
    }
  }
)

export const titleVariants = cva(
  'font-bold mb-4',
  {
    variants: {
      color: {
        green: 'text-green-600',
        blue: 'text-blue-600',
        red: 'text-red-600'
      },
      size: {
        small: 'text-xl',
        medium: 'text-2xl',
        large: 'text-4xl'
      }
    },
    defaultVariants: {
      color: 'green',
      size: 'large'
    }
  }
)

export const linkVariants = cva(
  'underline',
  {
    variants: {
      color: {
        blue: 'text-blue-600 hover:text-blue-800',
        green: 'text-green-600 hover:text-green-800',
        red: 'text-red-600 hover:text-red-800'
      }
    },
    defaultVariants: {
      color: 'blue'
    }
  }
)

export type ContainerProps = VariantProps<typeof containerVariants>
export type TitleProps = VariantProps<typeof titleVariants>
export type LinkProps = VariantProps<typeof linkVariants>
