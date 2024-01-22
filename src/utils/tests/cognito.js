import CognitoAuth from '@aws-amplify/auth';

export const mockUser = () => {
  jest.spyOn(CognitoAuth, 'currentAuthenticatedUser').mockResolvedValue({
    signInUserSession: {
      accessToken: {
        jwtToken:
          'eyJraWQiOiJkbzFYVSs3RFM5U21XbjVNZURCU0hnZEhTbGJPNVpCdjRicEZETytLUmhnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIyZGJmM2UyYS1hMGJiLTQxZjYtYTA2My00MTVhMTVmNGJiYzkiLCJkZXZpY2Vfa2V5IjoidXMtZWFzdC0xX2Y3ZjFmNzE2LWI4OTYtNDdiYy1hMTBjLWI2YjJkMzE4MjI1MiIsImNvZ25pdG86Z3JvdXBzIjpbIkR1YmJ6TmF0aXZlVXNlcnNHcm91cCJdLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9yMVlTN2FKUUoiLCJjbGllbnRfaWQiOiI3dTdwdHVzZTdxNXFubHB1ODhnMXRhZ21kNyIsIm9yaWdpbl9qdGkiOiI2Yzc1MmVhNy0yZDgyLTQ3OWItYTc3Zi04ZGRhOWRiZTUzOTEiLCJldmVudF9pZCI6Ijg3YTU3ZmE3LTVjYjYtNDY2MS05YTg1LTNkYjU4NDk2NmFiMSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2NjczMzI5MTQsImV4cCI6MTY2NzMzMzUxNCwiaWF0IjoxNjY3MzMyOTE0LCJqdGkiOiJiZDliYTFiZC04NGExLTQwM2QtYjM4Zi0xM2I2NWVmZjBhMmUiLCJ1c2VybmFtZSI6IjdlNThkNjNiLTYwMTktM2NlYi05NWExLWM0ODc5ODlhMzcyMCJ9.WCU08YMM4Uy2kVGgpjYlBXd3kEUArzBYwpemlx-QpEaSIICdb8m_Yz2NdFIwoxJ4fuI_mGKptNQOfyX8a7CRzpxKrpX-hG5znzNjdR_e5GPFMWvGV8b6WF-9Q8fs3daHmpmGPRNZ54Nry76Bbgs46XDI7dhYiFMvNYaOkuLSDo4FBjMhSUYVd7m9Mv-Rc09cdvLAFuWRlprqnzZ5_ZHEV626mdcsKHUhC3bif0MJ1WHUMEoWYmbzs5CsyqHIP8a6CTfjWIl2d4jS96Mh2DQJprjgBtPurtL5KdDmnQ8k3RYmXG3nZpKUDkssTig-3--ZxeL7W_d0O_sPDuk2knyikA',
        payload: {
          exp: Math.round(new Date() / 1000) + 60 * 60 * 24,
        },
      },
      refreshToken: '',
    },
  });
  return CognitoAuth;
};
