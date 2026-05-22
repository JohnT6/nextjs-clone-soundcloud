import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  palette: {
    mode: 'light'
    // mode: 'dark', // BƯỚC 1: Chuyển sang Dark Mode để chữ tự động thành màu Trắng
    // background: {
    //   default: '#121212', // BƯỚC 2: Ép màu nền của toàn bộ trang web
    //   paper: '#121212',   // Ép màu nền của các khối block (như thanh Header của bác)
    // },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.severity === 'info' && {
            backgroundColor: '#60a5fa',
          }),
        }),
      },
    },
  },
});

export default theme;
