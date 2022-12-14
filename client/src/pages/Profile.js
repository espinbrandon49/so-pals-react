import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import ThoughtForm from '../components/ThoughtForm';
import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';

import { QUERY_USER, QUERY_ME } from '../utils/queries';

import Auth from '../utils/auth';
import { ADD_FRIEND } from '../utils/mutations';

const Profile = () => {
  const [btnText, setBtnTxt] = useState('Add Pal')
  const [btnDisabled, setBtnDisabled] = useState(false)
  const { username: userParam } = useParams();
  const notMe = userParam !== Auth.username;

  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });
  const user = data?.me || data?.user || {};

  const [addFriend, { error2 }] = useMutation(ADD_FRIEND);

  const allUsersQuery = useQuery(QUERY_USER, {
    variables: { username: Auth.loggedIn() ? Auth.getProfile().data.username : "bambino1" }
  })

  const loggedInUser = allUsersQuery.data?.user.friends.map((value, i) => { return value.username }) || []

  useEffect(() => {
    if (loggedInUser.includes(user.username)) {
      setBtnTxt('PALS')
      setBtnDisabled(true)
    }
  }, [loggedInUser])


  if (!localStorage.getItem('id_token') || !user?.username) {
    return (
      <h4>
        You need to be logged in to see this. Use the navigation links above to
        sign up or log in!
      </h4>
    );
  }

  // navigate to personal profile page if username is yours
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to="/me" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const friendId = user._id
  const userId = Auth.getProfile().data._id
  const username = user._id
  const addFriendHandle = async (event) => {
    try {
      const { data } = await addFriend({
        variables: {
          userId,
          friendId,
          username
        },
      });
    } catch (err) {
      console.error(err)
    }
    setBtnTxt('Pal Added')
    setBtnDisabled(true)
  }

  return (
    <div className='d-flex flex-column align-content-center'>
      <h2 className="roboto text-center  h2 py-2">
        Viewing {data.me ? 'your' : `${user.username}'s`} profile.
      </h2>

      {data.user && (
        <div className='text-center'>
          <button
            className='btn btn-secondary btn-lg my-3'
            type='button'
            onClick={addFriendHandle}
            disabled={btnDisabled}
          >{btnText}</button>
        </div>
      )}

      <ThoughtList
        thoughts={user.thoughts}
        title={`${user.username}'s thoughts...`}
        showTitle={data.me ? false : true}
        showUsername={data.me ? false : true}
      />

      {!userParam && (
        <div className=''>
          <div
            className=''
            style={{ border: '1px dotted #dc3545' }}
          >
            <ThoughtForm />
          </div>
          <div className=''>
            <FriendList />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
