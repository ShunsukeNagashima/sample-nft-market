import { HTMLProps } from 'react';
import Image from 'next/image';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Container,
  Input,
  Textarea,
  Button,
  Box,
  Heading,
  CloseButton,
  Text,
  NumberInput,
  NumberInputField,
  HStack,
  useRadioGroup,
} from '@chakra-ui/react';
import { UseFormRegister, UseFormHandleSubmit, FieldErrors } from 'react-hook-form';
import { RadioCard } from '../../ui/radio-card';
import { FormInputs, TypeOfSell } from './new-nft.container';

type Props = {
  onSubmit: (data: FormInputs) => Promise<void>;
  onSwitch: (type: TypeOfSell) => void;
  onChange: (e: any) => Promise<void>;
  onClear: () => void;
  fileUrl: string;
  isLoading: boolean;
  howToSell: TypeOfSell;
  register: UseFormRegister<FormInputs>;
  handleSubmit: UseFormHandleSubmit<FormInputs>;
  errors: FieldErrors<FormInputs>;
};

export const NewNFTComponent: React.FC<Props> = (props) => {
  const { onSubmit, onSwitch, onChange, onClear, fileUrl, isLoading, howToSell, register, handleSubmit, errors } = props;

  const radioOptions = ['Fixed Price', 'Timed Auction'];

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'wayOfSelling',
    defaultValue: radioOptions[0],
    onChange: (name: TypeOfSell) => onSwitch(name),
  });

  const group = getRootProps();

  return (
    <Container maxW='container.md' mt={12}>
      <Heading as='h2' mb={6}>
        Create New Item
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <FormLabel>
            <Heading as='h3' size='md' mb={4}>
              Image
            </Heading>
          </FormLabel>
          <Box w={360} h={300} position={'relative'}>
            {fileUrl && <CloseButton onClick={onClear} position={'absolute'} right={4} top={4} zIndex={3} />}
            <FormLabel
              display={'flex'}
              htmlFor='file'
              border={'4px dashed'}
              borderColor={'brand.primary'}
              borderRadius={20}
              position={'absolute'}
              w={'100%'}
              h={'100%'}
              _hover={{ bg: 'gray.300', zIndex: 2, opacity: 0.7 }}
              zIndex={1}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <Image src='/image.png' width={60} height={60} alt='icon_for_image' />
            </FormLabel>

            {fileUrl && (
              <Box
                w={'90%'}
                h={'90%'}
                position={'absolute'}
                top={'50%'}
                left={'50%'}
                transform={'translate(-50%, -50%)'}
                rounded={30}
                zIndex={1}
                _hover={{ zIndex: 0 }}
              >
                <Image src={fileUrl} alt='selectedFile' layout='fill' />
              </Box>
            )}
          </Box>
          <Input
            hidden
            id='file'
            type='file'
            {...register('image', {
              required: 'Image is required',
            })}
            onChange={onChange}
            accept='.jpeg,.jpg,.png'
          />
          <FormHelperText>File types supported: JPG, PNG, JPEG</FormHelperText>
          <FormErrorMessage>{errors.image && errors.image.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.name} mt={6}>
          <FormLabel htmlFor='name'>
            <Heading as='h3' size='md' mb={4}>
              Name
            </Heading>
          </FormLabel>
          <Input
            id='name'
            placeholder='Item name'
            {...register('name', {
              required: 'Name is required',
              minLength: { value: 4, message: 'Minimum length should be 4' },
            })}
          />
          <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.description} mt={6}>
          <FormLabel htmlFor='file'>
            <Heading as='h3' size='md' mb={4}>
              Description
            </Heading>
          </FormLabel>
          <Textarea
            id='description'
            placeholder='Provide a detailed description of your item.'
            {...register('description', {
              required: 'Description is required',
              minLength: { value: 4, message: 'Minimum length should be 4' },
            })}
          />
          <FormErrorMessage>{errors.description && errors.description.message}</FormErrorMessage>
        </FormControl>

        <Heading as='h3' size='md' mt={6} mb={4}>
          Type
        </Heading>
        <Box display={'flex'} {...group}>
          {radioOptions.map((value) => {
            const radio = getRadioProps({ value });
            return (
              <RadioCard key={value} {...radio}>
                {value}
              </RadioCard>
            );
          })}
        </Box>

        {howToSell === 'Fixed Price' ? (
          <FormControl isInvalid={!!errors.name} mt={6}>
            <FormLabel htmlFor='price'>
              <Heading as='h3' size='md' mb={4}>
                Price
              </Heading>
            </FormLabel>
            <HStack display={'flex'} alignItems={'center'}>
              <NumberInput>
                <NumberInputField
                  id='price'
                  placeholder='Price'
                  {...register('price', {
                    required: 'Price is required',
                  })}
                />
              </NumberInput>
              <Box>ETH</Box>
            </HStack>

            <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
          </FormControl>
        ) : (
          <Text mt={6}>We are now preparing Timed Auction. Please wait until then.</Text>
        )}

        <Button
          type='submit'
          isLoading={isLoading}
          loadingText={'Creating Your NFT'}
          size='md'
          height='48px'
          width='200px'
          border='2px'
          bg={'brand.primary'}
          color={'white'}
          _hover={{ color: 'brand.primary', bg: 'white' }}
          mt={12}
          isDisabled={howToSell === 'Timed Auction'}
        >
          Create
        </Button>
      </form>
    </Container>
  );
};
