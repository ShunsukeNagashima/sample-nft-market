import { Box, Radio, RadioGroup, useRadio, useRadioGroup } from '@chakra-ui/react';

export const RadioCard = (props: any) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as='label' w='100%'>
      <input {...input} />
      <Box
        {...checkbox}
        display='flex'
        justifyContent='center'
        alignItems='center'
        cursor='pointer'
        borderWidth='1px'
        borderRadius='sm'
        boxShadow='md'
        color='gray.700'
        _checked={{
          bg: 'blue.50',
          color: 'black',
          borderColor: 'blue.50',
          fontWeight: 'bold',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={5}
        py={3}
        h={'50px'}
      >
        {props.children}
      </Box>
    </Box>
  );
};
