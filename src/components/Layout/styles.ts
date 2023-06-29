interface LayoutStyles {
    root: React.CSSProperties;
    header: React.CSSProperties;
    content: React.CSSProperties;
    footer: React.CSSProperties;
  }

export const styles: LayoutStyles = {
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        // backgroundColor: 'rgb(10, 25, 41)',
        color: 'rgb(51, 153, 255)',
      },
      header: {
        marginBottom: '2rem',
        backgroundColor: 'rgb(10, 25, 41)',
        borderBottom: '1px solid rgb(51, 153, 255)',
        color: 'rgb(51, 153, 255)',
      },
      content: {
        flex: 1,
      },
      footer: {
        marginTop: 'auto',
        backgroundColor: 'rgb(10, 25, 41)',
        padding: '2rem',
        borderTop: '1px solid rgb(51, 153, 255)',
      },
  };