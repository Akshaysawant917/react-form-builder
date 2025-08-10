import { Container, Typography, Box } from '@mui/material';
import img1 from '../assets/1.png';
import img2 from '../assets/2.png';
import img3 from '../assets/3.png';
import img4 from '../assets/4.png';
import img5 from '../assets/5.png';
import img6 from '../assets/6.png';
import img7 from '../assets/7.png';
const AgeCalculationTutorial = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Step-by-Step Tutorial: Creating an Age Calculation Form
      </Typography>

      {/* Step 1 */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom>
          1. Start from the Home Page
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Open the home page of your app. In the navigation bar, click on <strong>Create Form</strong> to start building a new form.
        </Typography>
        <Box
          component="img"
          src={img1}
          alt="Home page navigation to create form"
          sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}
        />
      </Box>

      {/* Step 2 */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom>
          2. Create a New Form
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Enter a name for your form (e.g., <code>Age Calculator</code>). Add your first field:<br />
          - Field Name: <strong>dob</strong><br />
          - Type: <strong>Date</strong>
        </Typography>
        <Box
          component="img"
          src={img2}
          alt="Create form with dob date field"
          sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}
        />
      </Box>

      {/* Step 3 */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom>
          3. Add Age Field with Derived Formula
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Add another field:<br />
          - Field Name: <strong>age</strong><br />
          - Type: <strong>Number</strong> or <strong>Text</strong><br />
          - Mark it as <strong>Derived</strong><br />
          - Select the parent field as <code>dob</code><br />
          - Enter the formula:
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'monospace',
            bgcolor: '#f5f5f5',
            p: 2,
            borderRadius: 1,
            mb: 2,
          }}
        >
          Math.floor((new Date() - new Date(dob)) / (1000 * 60 * 60 * 24 * 365.25))
        </Typography>
        <Box
          component="img"
          src={img3}
          alt="Add age derived field with formula"
          sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}
        />
      </Box>

      {/* Step 4 */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom>
          4. Save the Form
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Click the <strong>Save</strong> button to store your form.
        </Typography>
        <Box
          component="img"
          src={img4}
          alt="Save form button click"
          sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}
        />
      </Box>

      {/* Step 5 */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom>
          5. Access Your Form in My Forms
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Go to the <strong>My Forms</strong> page and select the form you just created.
        </Typography>
        <Box
          component="img"
          src={img5}
          alt="Select form from My Forms"
          sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}
        />
      </Box>

      {/* Step 6 */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom>
          6. Enter Date of Birth
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Enter your date of birth in the <code>dob</code> field.
        </Typography>
        <Box
          component="img"
          src={img6}
          alt="Enter date of birth"
          sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}
        />
      </Box>

      {/* Step 7 */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom>
          7. See Your Age Calculated Automatically
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          The <code>age</code> field will automatically calculate and display your age based on the DOB you entered.
        </Typography>
        <Box
          component="img"
          src={img7}
          alt="Age field showing calculated age"
          sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}
        />
      </Box>
    </Container>
  );
};

export default AgeCalculationTutorial;
