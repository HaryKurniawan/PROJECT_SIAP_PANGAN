import React from 'react';
import { Pressable, Text, PressableProps, ViewStyle, TextStyle } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  'flex-row items-center justify-center rounded-lg active:opacity-70',
  {
    variants: {
      variant: {
        default: 'bg-blue-500',
        outline: 'border border-gray-300 bg-transparent',
        secondary: 'bg-gray-200',
        ghost: 'bg-transparent',
        destructive: 'bg-red-500',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const textVariants = cva('font-medium', {
  variants: {
    variant: {
      default: 'text-white',
      outline: 'text-gray-900',
      secondary: 'text-gray-900',
      ghost: 'text-gray-900',
      destructive: 'text-white',
    },
    size: {
      default: 'text-base',
      sm: 'text-sm',
      lg: 'text-lg',
      icon: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface ButtonProps
  extends PressableProps,
    VariantProps<typeof buttonVariants> {
  className?: string;
  textClassName?: string;
  children: React.ReactNode;
}

const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  ({ className, textClassName, variant, size, children, ...props }, ref) => {
    return (
      <Pressable
        ref={ref}
        {...({
          className: cn(buttonVariants({ variant, size }), className),
        } as any)}
        {...props}
      >
        <Text
          {...({
            className: cn(textVariants({ variant, size }), textClassName),
          } as any)}
        >
          {children}
        </Text>
      </Pressable>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
