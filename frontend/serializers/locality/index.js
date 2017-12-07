import { Serializer } from 'jsonapi-serializer';

const LocalitySerializer = new Serializer('localities', {
  attributes: [
    'schoolType', 'schoolTypeCustom', 'schoolName', 'country',
    'state', 'postalCode', 'city', 'subjects',
  ],
});

export default LocalitySerializer;
