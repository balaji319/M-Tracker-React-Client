import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { ViewSingleRequestPage, mapStateToProps, mapDispatchToProps } from '../../app/containers/ViewSingleRequestPage';
import DefaultNavBar from '../../app/components/NavBar';
import SideNav from '../../app/components/SideNav';
import CreateRequestForm from '../../app/components/CreateRequest';
import ViewSingleRequest from '../../app/components/ViewSingleRequest';

const mockFunction = jest.fn();
mockFunction.mockResolvedValue({ status: 200 });
const props = {
  history: {
    push: mockFunction,
  },
  modifyRequestAdmin: mockFunction,
  authenticated: true,
  admin: true,
  updateRequest: mockFunction,
  match: {
    params: { requestId: 20 },
  },
  createRequest: mockFunction,
  getRequests: mockFunction,
  getAdminRequests: mockFunction,
  viewRequest: mockFunction,
  deleteRequest: mockFunction,
  request: {
    title: 'New Request',
    description: 'The description of my test request',
    type: 'repair',
    status: 'pending',
    createdat: '2018-09-04T18:11:56.976Z',
    firstname: 'John',
    lastname: 'Doe',
    email: 'user@test.com',
  },
  requests: [{
    title: 'New Request',
    description: 'The description of my test request',
    type: 'repair',
    status: 'approved',
    createdat: '2018-09-04T18:11:56.976Z',
    firstname: 'John',
    lastname: 'Doe',
    email: 'user@test.com',
  },
  {
    title: 'New Request',
    description: 'The description of my test request',
    type: 'repair',
    status: 'approved',
    createdat: '2018-09-04T18:11:56.976Z',
    firstname: 'John',
    lastname: 'Doe',
    email: 'user@test.com',
  }],
};
const mockState = {
  auth: {
    authenticated: true,
    user: { admin: true },
  },
  requests: {
    allRequests: props.requests,
    currentRequest: props.request,
  },
};

describe('View single request componenet', () => {
  it('should render without errors for admin', () => {
    const wrapper = shallow(<ViewSingleRequestPage {...props} />);
    expect(wrapper.find(DefaultNavBar)).toHaveLength(1);
    expect(wrapper.find(SideNav)).toHaveLength(1);
    expect(wrapper.find(CreateRequestForm)).toHaveLength(1);
    expect(wrapper.find(ViewSingleRequest)).toHaveLength(1);
  });

  it('should render without errors for admin', () => {
    const wrapper = shallow(<ViewSingleRequestPage {...props} admin={false} />);
    expect(wrapper).toBeTruthy();
  });

  it('should call viewRequest method when user is authenticated', () => {
    const wrapper = shallow(<ViewSingleRequestPage {...props} />);
    const instance = wrapper.instance();
    instance.componentDidMount();
    expect(instance.props.viewRequest).toHaveBeenCalled();
    expect(instance.props.viewRequest).toBeCalledWith(20);
  });

  it('should mapDispatchToProps', () => {
    const sinonSpy = sinon.spy();
    const result = mapDispatchToProps(sinonSpy);
    result.viewRequest();
    result.getRequests();
    result.createRequest();
    result.deleteRequest();
    result.updateRequest();
    result.getAdminRequests();
    result.modifyRequestAdmin();
    expect(sinonSpy.callCount).toBe(7);
  });

  it('should mapStateToProps', () => {
    const {
      history, requests, request, match,
    } = props;
    expect(mapStateToProps(mockState, { history, match }))
      .toEqual({
        requests,
        request,
        history,
        match,
        authenticated: mockState.auth.authenticated,
        admin: mockState.auth.user.admin,
      });
  });

  it('should handle delete button click', () => {
    const wrapper = shallow(<ViewSingleRequestPage {...props} admin={false} />);
    wrapper.find('[name="deleteIcon"]').simulate('click');
    expect(wrapper).toBeTruthy();
  });

  it('should handle approve button click', () => {
    const wrapper = shallow(<ViewSingleRequestPage {...props} admin />);
    wrapper.find('[name="approveIcon"]').simulate('click');
    expect(wrapper).toBeTruthy();
  });

  it('should handle disapprove button click', () => {
    const wrapper = shallow(<ViewSingleRequestPage {...props} admin />);
    wrapper.find('[name="disapproveIcon"]').simulate('click');
    expect(wrapper).toBeTruthy();
  });

  it('should handle resolved button click', () => {
    const { request } = props;
    const wrapper = shallow(<ViewSingleRequestPage
      {...props}
      request={{ ...request, status: 'approved' }}
      admin
    />);
    wrapper.find('[name="resolveIcon"]').simulate('click');
    expect(wrapper).toBeTruthy();
  });

  it('should handle delete and modify request events', () => {
    const wrapper = shallow(<ViewSingleRequestPage {...props} />);

    const instance = wrapper.instance();
    instance.handleDelete();
    instance.handleModification(2, 'approve');
    expect(instance).toBeTruthy();
  });
});
