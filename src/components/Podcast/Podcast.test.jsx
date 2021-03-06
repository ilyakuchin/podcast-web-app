import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Podcast } from './Podcast';

configure({ adapter: new Adapter() });

describe('Test Podcast Component', () => {
  test('should render correctly', () => {
    const wrapper = shallow(
      <Podcast
        isFetching={false}
        name='podacstName'
        description='podcastDescription'
        imageUrl='podcast image'
        jwt=''
      />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should render correctly when isFetching', () => {
    const wrapper = shallow(
      <Podcast
        isFetching
        name='podacstName'
        description='podcastDescription'
        imageUrl='podcast image'
        jwt=''
      />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should render correctly when jwt is not an empty string', () => {
    const wrapper = shallow(
      <Podcast
        isFetching={false}
        name='podacstName'
        description='podcastDescription'
        imageUrl='podcast image'
        jwt='jwt'
      />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
