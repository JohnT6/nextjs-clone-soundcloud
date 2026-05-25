'use client'
import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Divider,
    InputAdornment,
    IconButton,
    Stack,
    Container
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub'; // Import icon GitHub
import { signIn } from 'next-auth/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function AuthSignin() {
    const router = useRouter();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [errors, setErrors] = useState({
        username: '',
        password: ''
    });

    const [openMessage, setOpenMessage] = useState<boolean>(false);
    const [resMessage, setResMessage] = useState<string>('');

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        // Nếu user bấm ra ngoài khoảng không (clickaway) mà bác không muốn nó tắt thì để nguyên dòng này
        if (reason === 'clickaway') {
            return;
        }

        // Tín hiệu 'timeout' từ autoHideDuration sẽ lọt vào đây và tự động set false
        setOpenMessage(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let isValid = true;
        const newErrors = { username: '', password: '' };

        if (!username.trim()) {
            newErrors.username = 'Username không được để trống';
            isValid = false;
        }
        if (!password) {
            newErrors.password = 'Password không được để trống';
            isValid = false;
        }

        setErrors(newErrors);

        if (isValid) {
            const res = await signIn('credentials', {
                username: username,
                password: password,
                redirect: false
            })
            if (!res?.error) {
                // redirect to home
                router.push("/")
            } else {
                setOpenMessage(true);
                setResMessage(res.error)
            }
            console.log("Check res", res);

        }
    };

    const textFieldSx = {
        '& .MuiOutlinedInput-root': {
            backgroundColor: '#333333',
            color: 'white',
            borderRadius: '4px',
            '& fieldset': {
                borderColor: 'transparent',
            },
            '&:hover fieldset': {
                borderColor: '#666666',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#f50',
                borderWidth: '1px'
            },
        },
        '& .MuiInputLabel-root': {
            color: '#999999',
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#f50',
        },
        '& .MuiFormHelperText-root': {
            marginLeft: 0,
            color: '#ff3333'
        }
    };

    return (
        <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0, // BẮT BUỘC: Thêm cái này để neo chặt vào đáy
            // minHeight: '100vh', // XÓA DÒNG NÀY ĐI
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#121212',
            padding: 2
        }}>
            <IconButton
                component={Link}
                href="/"
                sx={{
                    position: 'absolute',
                    top: { xs: 16, sm: 24 },
                    left: { xs: 16, sm: 24 },
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(5px)',
                    transition: 'all 0.2s',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        transform: 'scale(1.05)'
                    }
                }}
                aria-label="Về trang chủ"
            >
                <ArrowBackIcon />
            </IconButton>
            <Container maxWidth="xs" sx={{ padding: 0 }}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        color: 'white',
                        fontWeight: 700,
                        marginBottom: 4,
                        textAlign: 'center'
                    }}
                >
                    Sign in or create an account
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={2.5}>
                        <TextField
                            fullWidth
                            id="username"
                            label="Your email address or username"
                            variant="outlined"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            error={!!errors.username}
                            helperText={errors.username}
                            sx={textFieldSx}
                        />

                        <TextField
                            fullWidth
                            id="password"
                            label="Your password"
                            variant="outlined"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSubmit
                                }
                            }}
                            error={!!errors.password}
                            helperText={errors.password}
                            sx={textFieldSx}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            sx={{ color: '#999999' }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disableElevation
                            sx={{
                                backgroundColor: '#f50',
                                color: 'white',
                                padding: '12px 0',
                                textTransform: 'none',
                                fontSize: '16px',
                                fontWeight: 500,
                                '&:hover': {
                                    backgroundColor: '#d14000',
                                }
                            }}
                        >
                            Sign In
                        </Button>
                    </Stack>
                </form>

                <Divider sx={{
                    my: 4,
                    '&::before, &::after': {
                        borderColor: '#444444'
                    },
                    color: '#999999',
                    fontSize: '14px'
                }}>
                    Or with social
                </Divider>

                {/* --- CHỈ GIỮ LẠI GOOGLE VÀ GITHUB --- */}
                <Stack spacing={1.5}>
                    <Button
                        variant="contained"
                        fullWidth
                        startIcon={<GoogleIcon />}
                        disableElevation
                        sx={{
                            backgroundColor: '#ffffff', // Google thường dùng nền trắng chữ đen hoặc nền xám
                            color: '#000000',
                            padding: '10px 0',
                            textTransform: 'none',
                            fontSize: '15px',
                            fontWeight: 500,
                            '&:hover': { backgroundColor: '#e0e0e0' }
                        }}
                    >
                        Continue with Google
                    </Button>

                    <Button
                        variant="contained"
                        fullWidth
                        startIcon={<GitHubIcon />}
                        disableElevation
                        onClick={() => signIn("github")}
                        sx={{
                            backgroundColor: '#24292e', // Màu đen đặc trưng của GitHub
                            color: 'white',
                            padding: '10px 0',
                            textTransform: 'none',
                            fontSize: '15px',
                            fontWeight: 500,
                            border: '1px solid #333',
                            '&:hover': { backgroundColor: '#1b1f23' }
                        }}
                    >
                        Continue with GitHub
                    </Button>
                </Stack>
            </Container>
            <Snackbar
                open={openMessage}
                autoHideDuration={5000}
                onClose={handleClose}   // ...nó sẽ tự động kích hoạt hàm này để tắt!
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {resMessage}
                </Alert>
            </Snackbar>
        </Box >
    );
}