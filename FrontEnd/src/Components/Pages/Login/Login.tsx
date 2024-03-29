import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './Login.css';
import Header from '../../Layout/Logo/Logo';
import { NavLink, useNavigate } from 'react-router-dom';
import { InputAdornment } from '@mui/material';
import { Email, Password } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import axios from 'axios';
import { vacation } from '../../../Redux/VacationStore';
import { adminLoginAction, userLoginAction } from '../../../Redux/UserReducer';
import backgroundImage from '../../../assets/images/bg.png';

function Copyright(props: any) {
  return (
    <Typography
      variant='body2'
      color='text.secondary'
      align='center'
      {...props}
    >
      {'Copyright © '}
      Shnitzel Vacations {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// theme for the login
const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#000000',
      paper: '#121212',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
  },
});
export default function Login() {
  // use navigate for page navigate
  const navigate = useNavigate();
  // new notyf for checking if email exists in database
  const notyf = new Notyf({
    position: {
      x: 'center',
      y: 'top',
    },
  });
  const onSubmit = async (data: any) => {
    // checking if email and password exists in database
    try {
      const response = await axios.post(
        'http://localhost:8080/api/v1/vacation/users/checkUser',
        { email: data.email, password: data.password }
      );

      if (response.data) {
        // get the first and last name by email
        const firstLastName = await axios.get(
          `http://localhost:8080/api/v1/vacation/users/getFirstLastName/${data.email}`
        );
        const { role, firstName, lastName, userKey } = firstLastName.data;

        if (role === 'admin') {
          // Dispatch admin login
          vacation.dispatch(adminLoginAction(firstName, lastName, role));
          // Dispatch user login
        } else {
          vacation.dispatch(
            userLoginAction(firstName, lastName, role, userKey)
          );
        }
        navigate('/vacations');
        // if email or password don't exists give an error notyf
      } else {
        notyf.error(
          'Invalid email or password. Please check your credentials and try again'
        );
      }
    } catch (error) {
      console.error(error);
      notyf.error(
        'Invalid email or password. Please check your credentials and try again'
      );
    }
  };

  // use form for form validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <ThemeProvider theme={theme}>
      <Grid
        className='Login'
        container
        component='main'
        sx={{ height: '96vh' }}
      >
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'left',
          }}
        />
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          sx={{ height: '100%' }}
        >
          <Box
            sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <Header style={{ zIndex: 999 }} />
            <Box
              sx={{
                height: '100%',
                my: -10,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component='h1' variant='h5'>
                Login
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  margin='normal'
                  fullWidth
                  id='email'
                  label='Email Address'
                  placeholder='Email Address'
                  autoFocus
                  {...register('email', {
                    required: true,
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  })}
                  error={Boolean(errors.email)}
                  helperText={
                    errors.email &&
                    'Email is required and must be a valid email address'
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  margin='normal'
                  fullWidth
                  label='Password'
                  type='password'
                  id='password'
                  placeholder='Password'
                  {...register('password', {
                    required: true,
                    minLength: 4,
                  })}
                  error={Boolean(errors.password)}
                  helperText={
                    errors.password &&
                    'Password must have a minimum of 4 characters'
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Password />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                <NavLink to='/register' className='button'>
                  {"Don't have an account? Register now!"}
                </NavLink>
                <Copyright sx={{ mt: 5 }} />
              </form>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
